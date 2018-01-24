#! /usr/bin/env node

const assert = require('assert')
const clear = require('clear')
const prompt = require('cli-prompt')
const tesourodireto = require('tesourodireto')
const colors = require('colors')
const Table = require('cli-table')

function imprimirCabecalho() {
  clear()
  console.log('TESOURO DIRETO')
  console.log('--------------')
  console.log('')
}

imprimirCabecalho()

prompt.multi([{
  label: 'Login',
  key: 'login'
}, {
  label: 'Senha',
  key: 'senha',
  type: 'password'
}], credenciais => {
  console.log('')
  console.log('Carregando dados, aguarde...')

  tesourodireto(credenciais).then(resultados => {
    imprimirCabecalho()
    
    resultados.forEach(resultado => {
      resultado = resultado[0]

      const { conta, titular, titulos } = resultado
      console.log(`${titular.nome} - ${conta.corretora} (CONTA: ${conta.conta})`)

      const table = new Table({
        head: [
          'Titulo'.bold.blue, 
          'Valor Investido'.bold.blue, 
          'Valor Liquido'.bold.blue, 
          'Valorização'.bold.blue
        ]
      })

      titulos.forEach(titulo => table.push([
        titulo.nome,
        titulo.valorInvestido,
        titulo.valorLiquidoAtual,
        titulo.valoresCalculados.valorizacao
      ]))
      
      const { totais } = resultado
      table.push([
        'TOTAIS'.bold,
        totais.valorInvestido.toString().bold,
        totais.valorLiquidoAtual.toString().bold,
        totais.valorizacao.bold
      ])

      console.log(table.toString())
      console.log()
    })
  })
})

