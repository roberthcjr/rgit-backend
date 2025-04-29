# Ferramentaria

Atualmente, muitas empresas gerenciam suas ferramentas e equipamentos por meio de planilhas, o que pode levar a erros, perda de informação e falta de controle sobre os ativos. Este projeto propõe o desenvolvimento de um sistema web para gestão de ferramentas, permitindo controle eficiente sobre empréstimos, devoluções, manutenção e estoque. O sistema facilitará a gestão através de uma interface intuitiva e funcionalidades que garantam maior rastreabilidade e segurança das informações. Com a adoção de tecnologias modernas, como bancos de dados relacionais, autenticação segura e dashboards interativos, o projeto visa otimizar o tempo dos gestores e reduzir prejuízos causados por perdas ou extravios.

# Como rodar
:warning: **Serviço apenas para o backend do projeto**: Para rodar a interface gráfica, verifique o repositório: https://github.com/roberthcjr/rgit-frontend

Clone o projeto
```bash
git clone https://github.com/roberthcjr/rgit-backend.git
```

Instale o Docker na sua máquina seguindo a própria documentação que está no seguinte link:

https://docs.docker.com/get-started/get-docker/

Utilize o comando com o gerenciador de pacotes da sua preferência o seguinte 

```bash
npm run service:up
```
```bash
pnpm run service:up
```
```bash
yarn run service:up
```

 para rodar o serviço em background ou 
 
 ```bash
 npm run service:watch
 ``` 
 ```bash
 pnpm run service:watch
 ``` 
 ```bash
 yarn run service:watch
 ``` 
 
 para rodar em modo debug, no qual as mudanças serão aplicadas quando salvar.

Quando finalizar, utilize os comandos 
```bash
npm run service:stop
```
```bash
pnpm run service:stop
```
```bash
yarn run service:stop
```
 e 
 ```bash
 npm run service:down
 ```
 ```bash
 pnpm run service:down
 ```
 ```bash
 yarn run service:down
 ```
 respectivamente, para parar e remover o container.
