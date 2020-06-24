import React, { useState } from 'react'
import Axios from 'axios'


function Lista(props) {

    const [selectedKey, setSelectedKey] = useState('selecione')
    const [filterValue, setFilterValue] = useState('')

    var hostname = props.hostname

    /*
        A função getHeader irá renderizar varios <th>'s representando cada chave daquele modelo.
    */
    function getHeader() {
        return (props.keys.map(key =>
            <th key={key} style={{ width: 'contain' }}>{key}</th>
        ))
    }

    //Popula a table
    function getItems(key, value) {
        var items = [];

        //Filtra os itens, ou seleciona todas se alguma das condicoes embaixo nao for satisfeita
        if (key !== 'selecione' && value !== '' && key !== undefined && value != undefined) { //Tem que ter isso daqui, só aceita
            props.items.map((item) => {
                if (item[key].toLowerCase().includes(value.toLowerCase())) {
                    items.push(item)
                }
            });
        } else {
            props.items.map((item) => items.push(item))
        }

        return items.map((item) =>                          //Percorre todos os itens filtrados Cria uma row com id(key) unica (javascript requer que isso seja feito)
            <tr key={item[Object.keys(item)[0]]}>
                <th key={`delete-${item[Object.keys(item)[0]]}`}>
                    <input type='button' name='delete' value='deletar' onClick={() => deleteRow(item[Object.keys(item)[0]])}></input>
                </th>
                {Object.keys(item).map(key => {
                    if (props.keys.includes(key))          //Pra cada key desse modelo, adiciona seu valor respectivo
                        return <th key={item[Object.keys(item)[0]] + '-' + item[key]}>{item[key]}</th>    //Na key fazenda_id, vai adicionar o id da fazenda, etc.
                })}
            </tr>
        )
    }

    //Popula o seletor de filtro
    function getFilter() {
        return props.keys.map(key =>                      //Pega todas as keys daquele modelo 
            <option key={key} value={key}>{key}</option>  //Popula o seletor com eles
        )
    }

    function addRow() {
        var newObject = {}

        props.keys.forEach((key) => {
            if (key !== props.primary_key) {
                var result = ''
                do {
                    console.log('Pedindo a key: ', key)
                    result = prompt(key)
                }//TODO Fazer com que coisas em branco nao possam ser colocadas!!!
                while (result === '')
                newObject[key] = result
            }
        })


        Axios.post(`${hostname}/${props.route}`, newObject)
    }

    function deleteRow(primaryKey) {
        // Nao apagar esse comentario de baixo, ele faz o confirm funcionar, se tirar o confirm pode tirar o comentario
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Voce tem certeza que deseja deletar o item?')) {
            Axios.delete(`${hostname}/${props.route}/${primaryKey}`)
        }
    }

    return (
        <div style={{ margin: '20px' }}>
            <form>
                Filtrar por:
                <select value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>,
                    <option>selecione</option>
                    {getFilter()}
                </select>

                <input type='text' name='filterText' value={filterValue} onChange={(e) => setFilterValue(e.target.value)}></input>
                <input style={{ display: 'flex', float: 'right' }} type='button' name='update' value='adicionar' onClick={() => addRow()}></input>
            </form>

            <div style={{ overflowX: 'auto' }}>
                <table width='100%'>
                    <thead style={{ fontSize: '2vw', color: 'black' }}>
                        <tr>
                            <th>deletar</th>
                            {getHeader()}
                        </tr>
                    </thead>
                    <tbody>
                        {getItems(selectedKey, filterValue)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Lista