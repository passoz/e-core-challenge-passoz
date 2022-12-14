# Desafio E-core Serverless

[Pré requisitos](#pre-requisitos) |
[Download e instalação](#download-e-instalação) |
[Documentação](#documentação)


## Pré requisitos
Para rodar este projeto é necessário:
 * Um usuário no IAM da AWS com permissões para administração de:
   * Buckets S3
   * CloudFormation
   * DynamoDB
   * API Gateway
   * Funções Lambda
 * Uma conta criada no site do [Serverless Framework](https://serverless.com).
 * Git instalado.
 * Node.js e npm instalados.


## Download e instalação
Será necessário a instalação do utilitário de linha de comando do serverless:

```sh
# instalando o utilitário
npm install -g serverless
```

Agora precisamos clonar este repositório:

```sh
# clonando o repositório
git clone https://github.com/passoz/e-core-challenge-passoz.git
```

Entre no diretório:

```sh
# clonando o repositório
cd e-core-challenge-passoz
```
No arquivo serverless.yml mude de:
```yaml
org: passoz
```
Para:

```yaml
org: <nome-do-seu-usuario-no-serverless>
```
Instale as dependências:
```sh
# instalando dependências
npm install
```
Adicione o projeto à sua conta no Serverless Framework e realize o deploy da aplicação:
```sh
# faça o login com sua conta do serverless
serverless login

# adicionando o projeto no serverless. 
serverless --org=<nome-do-seu-usuario-no-serverless>

# deploy da aplicação
serverless deploy
```

## Documentação

[Clique aqui e acesse a documentação](https://passoz.github.io/e-core-challenge-passoz/)