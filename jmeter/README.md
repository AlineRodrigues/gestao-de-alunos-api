# Testes de carga da API de pets com JMeter

O arquivo `pets-load-test.jmx` contém dois cenários independentes. Ambos executam o mesmo fluxo autenticado: fazem login em `POST /api/auth/login`, extraem `$.token` da resposta, enviam `Authorization: Bearer <token>`, cadastram um pet em `POST /api/pets` e consultam a coleção em `GET /api/pets`. Na URL pública do serviço, esses recursos correspondem a `/pets` sob o prefixo `/api`.

## Pré-requisitos

- Java e Apache JMeter 5.5 ou superior (o modelo aberto é suportado pelo JMeter, sem plugin adicional).
- API em execução e banco MongoDB disponível. Siga a instalação descrita no README da raiz.
- Credenciais de demonstração do seed: `admin@escola.com` / `admin123`.

## Cenários

- **Modelo fechado**: 10 usuários concorrentes, rampa de 10 segundos e duração de 60 segundos. Cada usuário inicia uma iteração após a anterior completar.
- **Modelo aberto**: chegada de 2 novos fluxos por segundo durante 60 segundos. Uma pausa final de 30 segundos permite concluir os fluxos já iniciados.

Ambos os grupos começam habilitados. Para comparar os modelos, execute-os juntos como fornecidos ou desabilite um grupo pela GUI do JMeter para medir cada cenário separadamente.

## Execução

Abra `pets-load-test.jmx` no JMeter ou rode em modo não gráfico:

```bash
jmeter -n -t jmeter/pets-load-test.jmx -l results.jtl
```

O padrão aponta para `http://localhost:3000`. Para alterar host, porta, credenciais e duração sem editar o arquivo:

```bash
jmeter -n -t jmeter/pets-load-test.jmx -Jbase_host=localhost -Jbase_port=3000 -Jadmin_email=admin@escola.com -Jadmin_password=admin123 -Jduration=60 -Jopen_duration=60 -l results.jtl
```

Os parâmetros `closed_users` e `closed_ramp` também podem ser substituídos por `-Jclosed_users=20 -Jclosed_ramp=15`. Resultados de carga podem criar muitos documentos de pets; use uma instância de teste, não produção.

## O que cada peça faz

1. Os HTTP Request Defaults definem protocolo, host e porta em um lugar só.
2. O sampler de login envia JSON para a autenticação já existente da API.
3. O JSON PostProcessor guarda o JWT por usuário virtual. Uma asserção confirma HTTP 200 no login.
4. O sampler POST envia um corpo válido; o nome inclui UUID para evitar colisões. A asserção espera HTTP 201.
5. O sampler GET lista os pets com o mesmo JWT. A asserção espera HTTP 200.
6. Os grupos diferem apenas na geração de carga: usuários concorrentes fixos no modelo fechado; taxa de chegadas definida pelo tempo no modelo aberto.
