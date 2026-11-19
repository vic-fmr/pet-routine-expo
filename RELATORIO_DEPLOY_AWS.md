# Relatorio detalhado: configuracao e deploy AWS do Pet Routine

**Data da implantacao:** 19 de novembro de 2026  
**Projeto:** `vic-fmr/pet-routine-expo`  
**Commit criado:** `6d3f7fdd7902341f4ed9bb9b4d1002a0f02393be`  
**Branch no momento do commit:** `deploy/deploy-aws-config`  

## 1. Resumo executivo

O backend foi preparado para executar em producao em uma unica instancia Amazon EC2 com Docker. O banco SQLite continua sendo local ao volume persistente do container, em vez de ser colocado dentro da imagem Docker.

No final da implantacao:

- o backend estava publico em `https://18.189.8.54.sslip.io`;
- o health check respondia por HTTPS;
- login da conta demo funcionava;
- criacao e listagem de pets funcionavam;
- o SQLite manteve os dados apos reiniciar o container;
- o app Expo foi configurado para usar esse endereco AWS;
- o worktree foi comitado e ficou limpo.

A URL usa `sslip.io` como dominio temporario para o certificado TLS. Para um ambiente definitivo, ela deve ser substituida por um dominio proprio em Route 53 ou em outro provedor DNS.

## 2. Arquitetura implantada

```text
Expo / app mobile
        |
        | HTTPS:443
        v
Nginx na EC2
        |
        | HTTP interno:127.0.0.1:3000
        v
Docker Compose
        |
        v
Container Node 22 / Express
        |
        v
Volume Docker pet-routine-data
        |
        v
/var/lib/pet-routine/pet-routine.db
```

Componentes AWS criados:

- 1 instancia EC2 `i-0bdc8bfffc3caa586`;
- tipo `t3.micro`;
- Ubuntu Server 24.04 LTS;
- AMI `ami-06013a79bb46505e8`;
- Elastic IP `18.189.8.54`;
- EBS `gp3` de 8 GB;
- volume EBS `vol-0ab85a556ec9085bb`;
- VPC padrao `vpc-03c383176a722bf95`;
- subnet `subnet-0c2fc95db0b227b5e`;
- Security Group `sg-0da2898bb1dd2f7f8`;
- chave EC2 `pet-routine-admin-key`;
- perfil AWS local `pet-routine-admin`.

Conta utilizada:

- account ID: `832272400576`;
- regiao configurada no perfil: `us-east-2`;
- plano observado no momento: `FREE`, ativo.

## 3. Alteracoes feitas no codigo do backend

### 3.1. Scripts de producao no `backend/package.json`

Foi adicionado um comando para compilar o TypeScript:

```json
"build": "tsc"
```

Foi adicionado um comando para iniciar a versao compilada:

```json
"start:prod": "node dist/server.js"
```

Esses scripts permitem que o Docker compile o projeto em uma etapa separada e execute somente JavaScript em producao.

Os scripts continuaram existentes:

- `dev`: desenvolvimento com `tsx watch`;
- `start`: execucao direta do TypeScript;
- `seed`: inicializacao/populacao do SQLite;
- `typecheck`: verificacao estatica.

### 3.2. Dockerfile multi-stage

O arquivo [backend/Dockerfile](./backend/Dockerfile) foi criado com duas etapas.

Na etapa de build:

- usa `node:22-bookworm-slim`;
- instala as dependencias pelo `npm ci`;
- copia `tsconfig.json`;
- copia `src`;
- executa `npm run build`;
- gera a pasta `dist`.

Na etapa runtime:

- usa uma imagem Node enxuta;
- define `NODE_ENV=production`;
- define `PORT=3000`;
- define `DB_PATH=/var/lib/pet-routine/pet-routine.db`;
- cria o diretorio `/var/lib/pet-routine`;
- executa `npm ci --omit=dev`;
- copia somente `dist`;
- expõe a porta `3000`;
- declara `/var/lib/pet-routine` como volume;
- executa o processo como usuario `node`;
- inicia com `npm run start:prod`.

O Docker nao usa o banco SQLite fornecido pelo repositorio dentro da imagem. O banco fica em um volume separado.

### 3.3. Docker Compose

O arquivo [backend/docker-compose.yml](./backend/docker-compose.yml) foi criado com:

- servico chamado `backend`;
- `restart: unless-stopped`;
- bind da porta somente em `127.0.0.1:3000`;
- variavel `JWT_SECRET` obtida do `.env`;
- banco no caminho `/var/lib/pet-routine/pet-routine.db`;
- volume nomeado `pet-routine-data`.

A porta foi mantida ligada somente ao localhost do servidor. Dessa forma, o container nao fica diretamente exposto pela internet. O Nginx publica e faz proxy para `127.0.0.1:3000`.

### 3.4. `.dockerignore`

O arquivo [backend/.dockerignore](./backend/.dockerignore) evita que entrem no contexto de build:

- `node_modules`;
- logs npm;
- `dist`;
- arquivos `.env` e `.env.*`;
- `pet-routine.db`;
- `pet-routine.db-shm`;
- `pet-routine.db-wal`.

Isso impede que banco local e segredo JWT sejam incorporados indevidamente na imagem Docker.

### 3.5. Modelo persistente do SQLite

Nao houve migracao para PostgreSQL. O SQLite foi preservado por compatibilidade com o codigo atual.

O banco e apontado para:

```text
/var/lib/pet-routine/pet-routine.db
```

O volume Docker permanece entre reinicios do container e reinicios da aplicacao. O teste comprovou a persistencia: um pet criado pela API continuou existindo depois de `docker compose restart backend`.

Limitacao conhecida:

- uma unica instancia EC2 deve ser usada;
- varias replicas no ECS/App Runner nao compartilham este SQLite;
- para escalar horizontalmente ou usar mais de uma instancia, o projeto precisara migrar para RDS ou outro banco compartilhado.

### 3.6. Exemplo de ambiente do backend

O [backend/.env.example](./backend/.env.example) passou a conter um valor que deve ser substituido:

```dotenv
JWT_SECRET=replace_with_a_long_random_secret
DB_PATH=./pet-routine.db
```

Na EC2, o arquivo `.env` real nao foi incluido no repositorio. Ele ficou em:

```text
/opt/pet-routine-expo/backend/.env
```

O valor contem o JWT secreto gerado aleatoriamente no ambiente local e usado pelo Docker Compose.

### 3.7. Documentacao no backend

O [backend/README.md](./backend/README.md) recebeu uma secao com:

- requisitos da instancia;
- portas do Security Group;
- Docker e Docker Compose;
- geracao do segredo JWT;
- construcao e inicializacao;
- persistencia;
- Nginx/HTTPS;
- URL do Expo.

## 4. Alteracoes feitas no app Expo

### 4.1. URL da API

Os perfis `preview` e `production` do [eas.json](./eas.json) passaram a apontar para:

```text
https://18.189.8.54.sslip.io
```

O arquivo `.env` local passou a conter:

```dotenv
EXPO_PUBLIC_API_URL=https://18.189.8.54.sslip.io
```

O mesmo endereco foi colocado em:

- `.env.example`;
- `.env_example`.

O [src/services/api.ts](./src/services/api.ts) ja resolvia `EXPO_PUBLIC_API_URL` primeiro. Portanto, nao foi necessario alterar o codigo do cliente HTTP.

### 4.2. Botao “Cadastrar primeiro pet”

A tela [src/app/(tabs)/index.tsx](./src/app/(tabs)/index.tsx) recebeu uma mudanca visual no estado sem pets:

- o botao ocupa toda a largura disponivel;
- tem largura maxima de 360 px;
- altura minima de 72 px;
- aparece centralizado verticalmente no estado vazio;
- mostra o simbolo `＋`;
- mostra o texto “Cadastrar primeiro pet”;
- usa as cores principal e pressionada do tema;
- mantem `accessibilityRole="button"` e uma label acessivel.

O estado vazio recebeu `flex: 1`, altura minima e centralizacao. O `contentContainerStyle` da lista recebeu `flexGrow: 1` para que o estado vazio tenha a altura necessaria.

### 4.3. Validacao do frontend

Apos a alteracao visual, o comando abaixo passou sem erros:

```powershell
npm.cmd run typecheck
```

Isso confirmou compatibilidade de tipos, mas nao substituiu um teste visual em Expo.

## 5. Configuracao do Agent Toolkit da AWS

O Agent Toolkit foi configurado no Windows com os seguintes dados:

- perfil AWS: `pet-routine-admin`;
- region de perfil: `us-east-2`;
- toolkit remote: `us-east-1`;
- experiencia AWS: novo AWS Experience.

Ferramentas instaladas:

- AWS CLI v2 `2.41.1`;
- uv `0.13.9`.

O AWS CLI criou o perfil autenticado e confirmou a identidade assumida:

```text
Account: 832272400576
Arn: arn:aws:sts::832272400576:assumed-role/AccountFullAccessRole/24d804d8-e0d1-7011-72ce-e7b3776a1953
```

O agente configurou o MCP `aws-mcp` no Gemini CLI e registrou o perfil:

```json
"env": {
  "AWS_MCP_PROXY_PROFILES": "pet-routine-admin"
}
```

As skills AWS remotas foram listadas com sucesso. Os hooks e skills ficaram configurados no ambiente do Gemini CLI.

## 6. Diferenca entre Agent Toolkit/MCP e os comandos usados no deploy

É importante diferenciar os recursos:

- o Agent Toolkit e o MCP AWS foram configurados;
- o MCP foi configurado para uso futuro em ferramentas suportadas;
- **a criacao da EC2, o upload e a execucao nao foram realizados por um MCP server de arquivos/servidor AWS**;
- os recursos AWS foram criados com AWS CLI executado pelo PowerShell;
- o codigo foi enviado por SCP via SSH;
- Docker, Nginx e arquivos no servidor foram configurados por SSH.

Portanto, a resposta correta nao e “upload feito via AWS MCP”. O upload foi feito via SSH/SCP a partir de uma chave privada local.

## 7. Passos reais do deploy na AWS

### Passo 1: verificacao da conta

Foi executado:

```powershell
aws freetier get-account-plan-state --profile pet-routine-admin --region us-east-2
```

Resultado:

```text
accountPlanType: FREE
accountPlanStatus: ACTIVE
remainingCredits: 100 USD
expirationDate: 2027-05-19
```

### Passo 2: verificacao da rede

Foi localizado o VPC padrao:

```text
vpc-03c383176a722bf95
172.31.0.0/16
```

Foi localizada uma subnet:

```text
subnet-0c2fc95db0b227b5e
```

Nao havia instancia EC2 existente para este projeto no momento da verificacao.

### Passo 3: resolucao da AMI Ubuntu

Foi consultado o SSM:

```powershell
aws ssm get-parameter `
  --name /aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id `
  --profile pet-routine-admin `
  --region us-east-2
```

AMIs usada:

```text
ami-06013a79bb46505e8
```

### Passo 4: criacao da chave SSH

Foi criada uma chave RSA local sem senha:

```text
C:\Users\victo\.ssh\pet-routine-admin.pem
C:\Users\victo\.ssh\pet-routine-admin.pem.pub
```

A chave publica foi importada para EC2:

```powershell
aws ec2 import-key-pair `
  --key-name pet-routine-admin-key `
  --public-key-material fileb://C:/Users/victo/.ssh/pet-routine-admin.pem.pub `
  --profile pet-routine-admin `
  --region us-east-2
```

### Passo 5: identificacao do IP administrativo

Foi consultado o IP publico local:

```text
200.124.165.165
```

Esse IP foi usado para restringir SSH na criacao do Security Group.

### Passo 6: criacao do Security Group

Foi criado `pet-routine-backend-sg` na VPC padrao:

- SSH, porta 22: `200.124.165.165/32`;
- HTTP, porta 80: `0.0.0.0/0`;
- HTTPS, porta 443: `0.0.0.0/0`.

Depois da configuracao do Certbot, a porta 443 foi aberta separadamente.

A porta `3000` nao foi aberta diretamente para a internet.

### Passo 7: criacao da instancia

Comando de criacao:

```powershell
aws ec2 run-instances `
  --image-id ami-06013a79bb46505e8 `
  --instance-type t3.micro `
  --count 1 `
  --key-name pet-routine-admin-key `
  --security-group-ids sg-0da2898bb1dd2f7f8 `
  --subnet-id subnet-0c2fc95db0b227b5e `
  --associate-public-ip-address `
  --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=8,VolumeType=gp3,DeleteOnTermination=true}' `
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=pet-routine-backend}]'
```

ID retornado:

```text
i-0bdc8bfffc3caa586
```

Estado inicial:

```text
pending
```

Depois o estado passou para:

```text
running
```

### Passo 8: Elastic IP

Foi reservado um Elastic IP:

```text
18.189.8.54
```

Ele foi associado a:

```text
i-0bdc8bfffc3caa586
```

### Passo 9: instalacao inicial no servidor

O servidor recebeu Docker no processo de provisionamento. O deploy final foi feito por SSH.

Os pacotes remotos instalados incluem:

- Docker Engine;
- Docker Compose;
- Nginx;
- Certbot;
- Python plugin do Certbot para Nginx;
- `unzip`.

### Passo 10: empacotamento local do backend

Foi criada uma copia temporaria da pasta `backend`, removendo:

- `node_modules`;
- `dist`.

Depois ela foi compactada como `backend.zip`.

O conteudo efetivamente enviado foi preparado manualmente, nao pelo MCP.

### Passo 11: upload por SCP

Foi executado:

```powershell
scp -i C:\Users\victo\.ssh\pet-routine-admin.pem `
  -o StrictHostKeyChecking=accept-new `
  C:\Users\victo\.copilot\session-state\459594de-9403-450c-96f0-bb8341dcd7d5\backend.zip `
  ubuntu@18.189.8.54:/tmp/backend.zip
```

O host foi registrado no arquivo `known_hosts` do Windows.

### Passo 12: instalacao no servidor

Por SSH:

```powershell
ssh -i C:\Users\victo\.ssh\pet-routine-admin.pem `
  ubuntu@18.189.8.54
```

No servidor:

```bash
sudo apt-get update
sudo apt-get install -y unzip
sudo mkdir -p /opt/pet-routine-expo/backend
sudo unzip -o /tmp/backend.zip -d /opt/pet-routine-expo/backend
```

O zip continha tambem arquivos SQLite locais como parte da pasta exportada. Eles foram ignorados pelo `.dockerignore` no contexto Docker, que não enviou banco nem arquivos de ambiente para a imagem.

### Passo 13: segredo JWT

Foi gerado um segredo criptograficamente aleatorio de 48 bytes no Windows e gravado no servidor:

```dotenv
JWT_SECRET=<96 caracteres hexadecimais>
```

O valor não foi comitado no repositorio.

### Passo 14: construcao e inicializacao Docker

No servidor:

```bash
cd /opt/pet-routine-expo/backend
sudo docker compose up -d --build
```

Docker criou:

- imagem `backend-backend`;
- container `backend-backend-1`;
- volume `backend_pet-routine-data`;
- rede `backend_default`.

A porta do container ficou ligada somente a:

```text
127.0.0.1:3000
```

### Passo 15: health check interno

Foi validado no servidor:

```bash
curl -fsS http://127.0.0.1:3000/health
```

Resposta:

```json
{
  "status": "ok",
  "service": "pet-routine-backend",
  "timestamp": "2026-11-19T13:13:50.874Z"
}
```

## 8. Configuracao do Nginx e HTTPS

### Dominio temporario

Foi utilizado:

```text
18.189.8.54.sslip.io
```

O DNS desse endereco apontava para o Elastic IP.

### Configuracao do proxy

O Nginx foi configurado para:

- receber HTTP em porta 80;
- receber HTTPS em porta 443;
- encaminhar para `127.0.0.1:3000`;
- encaminhar `Host`, `X-Real-IP`, `X-Forwarded-For` e `X-Forwarded-Proto`.

### Certificado TLS

Foi instalado o Certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx --redirect \
  -d 18.189.8.54.sslip.io \
  --register-unsafely-without-email \
  --agree-tos \
  --non-interactive
```

Foi emitido um certificado com validade exibida ate `2027-02-17`.

O Certbot:

- adicionou o certificado ao Nginx;
- configurou redirecionamento HTTP -> HTTPS;
- criou renovacao automatica.

Foi necessario abrir a porta 443 no Security Group:

```powershell
aws ec2 authorize-security-group-ingress `
  --group-id sg-0da2898bb1dd2f7f8 `
  --ip-permissions 'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}]'
```

## 9. Testes realizados

### Health check HTTP

```text
GET http://18.189.8.54/health
```

Retornou `status: ok`.

### Health check HTTPS

```text
GET https://18.189.8.54.sslip.io/health
```

Retornou `status: ok`.

### Login

Credenciais testadas:

```text
e-mail: tutor@cesar.school
senha: 123456
```

Endpoint testado:

```text
POST https://18.189.8.54.sslip.io/api/auth/login
```

A resposta trouxe um JWT e o usuario demo.

### Persistencia do SQLite

Foi criado um pet chamado `AWS Persistence Check` pela API HTTPS.

Depois foi executado:

```bash
cd /opt/pet-routine-expo/backend
sudo docker compose restart backend
```

Apos o reinicio, o pet foi encontrado pela API com o mesmo nome e ID.

Depois o pet de teste foi removido pela API.

### Typecheck

O frontend passou no:

```powershell
npm.cmd run typecheck
```

## 10. Commit final

Todas as alteracoes foram adicionadas e commitadas.

Commit:

```text
6d3f7fdd7902341f4ed9bb9b4d1002a0f02393be
```

Mensagem:

```text
feat: add AWS backend deployment support

Configure Docker and persisted SQLite deployment, point app builds to the AWS API,
and center the first-pet action.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

Arquivos adicionados ou alterados:

```text
.env.example
.env_example
backend/.dockerignore
backend/.env.example
backend/Dockerfile
backend/README.md
backend/docker-compose.yml
backend/package.json
eas.json
src/app/(tabs)/index.tsx
```

Nenhuma chave privada ou segredo JWT foi adicionada ao commit.

## 11. Estado atual da infraestrutura

```text
Instance: i-0bdc8bfffc3caa586
State: running
Type: t3.micro
Region: us-east-2
Elastic IP: 18.189.8.54
Public URL: https://18.189.8.54.sslip.io
Volume: vol-0ab85a556ec9085bb
Container: backend-backend-1
Service: backend
```

O backend ja pode ser usado pelo frontend sem executar servidor local.

## 12. Observacoes importantes

### 12.1. SQLite nao suporta escala horizontal

O volume do Docker fica dentro da instancia EC2. Outro servidor EC2 nao enxergara automaticamente esse arquivo.

Para subir varias instancias ou escalar com ECS/App Runner, sera necessario migrar para RDS/PostgreSQL ou MySQL.

### 12.2. Elastic IP

O Elastic IP foi associado a instancia em execucao. Deve haver cuidado para nao criar Elastic IP sem instancia associada, pois contas podem ser cobradas por endereco nao associado.

### 12.3. Dominio temporario

`sslip.io` e util para testes. Para a entrega definitiva, recomenda-se:

- comprar ou usar um dominio proprio;
- criar registro DNS no Route 53 ou outro provedor;
- emitir novo certificado TLS para esse dominio;
- atualizar `.env`, `.env.example` e `eas.json`.

### 12.4. Backups

O volume Docker nao substitui backup.

Recomendacoes:

- snapshots periodicos do EBS;
- backup consistente do SQLite;
- monitoramento do disco;
- renovacao Certbot periodica.

### 12.5. Custos

O plano observado esta como FREE com credito. Isso pode mudar conforme:

- vencimento dos creditos;
- aumento de disco;
- Elastic IP nao associado;
- snapshots;
- transferencias de dados.

## 13. Comandos principais para operar a instancia

Conectar por SSH:

```powershell
ssh -i C:\Users\victo\.ssh\pet-routine-admin.pem ubuntu@18.189.8.54
```

Ver logs:

```bash
cd /opt/pet-routine-expo/backend
sudo docker compose logs --tail 100 backend
```

Reiniciar:

```bash
cd /opt/pet-routine-expo/backend
sudo docker compose restart backend
```

Reconstruir apos nova versao:

```bash
cd /opt/pet-routine-expo/backend
git pull
sudo docker compose up -d --build
```

Health check:

```bash
curl -fsS https://18.189.8.54.sslip.io/health
```
