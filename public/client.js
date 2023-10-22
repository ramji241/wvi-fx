const generateRandomString = length => [...Array(length)].map(() => Math.random().toString(36)[2].join(''))

class ObjCashFlow {
    constructor(type, typeCertainty, amount, amountCertainty, date, dateCertainty, typeId, status) {
        this.type = type;
        this.typeCertainty = typeCertainty;
        this.amount = amount;
        this.amountCertainty = amountCertainty;
        this.date = date;
        this.dateCertainty = dateCertainty;
        this.typeId = typeId;
        this.status = status
    }
}

const allEvents = []

const createEvent = (status) => {
    const newEvent = new ObjCashFlow(
        document.getElementById('typeCashFlowDetail').value,
        document.getElementById('rangeCertaintyType').value,
        document.getElementById('amountCashFlowDetail').value,
        document.getElementById('rangeCertaintyAmount').value,
        document.getElementById('dateCashFlowDetail').value,
        document.getElementById('rangeCertaintyDate').value,
        document.getElementById('typeIdCashFlowDetail').value,
        status
    )

    allEvents.push(newEvent)

    refreshTable()
}

const refreshTable = () => {
    const cols = [...new Set(allEvents.map(event => event.date))]
    
    for (date in cols) {
        const thDate = document.createElement('th')
        thDate.className = 'thDate'
        thDate.innerHTML = cols[date]
        document.getElementById('trDate').appendChild(thDate)
    }

    const rows = []

    do {
        const tempArray = []
        tempArray.push(allEvents.shift())
        if (allEvents.length > 0) {
            allEvents.forEach((event, index) => {
                (event.type === tempArray[0].type && event.typeId === tempArray[0].typeId) && tempArray.push(allEvents.splice(index, 0))
            })
        }
        rows.push(tempArray)
    } while (allEvents.length > 0)
    
    rows.forEach(array => {
        const trType = document.createElement('tr')
        trType.className = 'trCashFlows'
        document.getElementById('tbodyEvents').appendChild(trType)

        const thType = document.createElement('th')
        thType.className = 'thCashFlows'
        thType.innerHTML = (array[0].typeId !== '') ? `${array[0].type} (${array[0].typeId})` : `${array[0].type}`
        trType.appendChild(thType)

        array.forEach(event => {
            const tdCashFlows = document.createElement('td')
            tdCashFlows.className = 'tdCashFlows'
            tdCashFlows.innerHTML = event.amount
            tdCashFlows.dataset.type = event.type
            tdCashFlows.dataset.typeCertainty = event.typeCertainty
            tdCashFlows.dataset.amount = event.amount
            tdCashFlows.dataset.amountCertainty = event.amountCertainty
            tdCashFlows.dataset.date = event.date
            tdCashFlows.dataset.dateCertainty = event.dateCertainty
            tdCashFlows.dataset.typeId = event.typeId
            tdCashFlows.dataset.status = event.status
            trType.appendChild(tdCashFlows)
        })

        trType.addEventListener('click', (event) => {
            document.getElementById('asideCashFlowDetails').classList.toggle('hidden')
        
            document.getElementById('typeCashFlowDetail') = event.target.dataset.type
            document.getElementById('rangeCertaintyEvent') = event.target.dataset.typeCertainty
            document.getElementById('amountCashFlowDetail') = event.target.dataset.amount
            document.getElementById('rangeCertaintyAmount') = event.target.dataset.amountCertainty
            document.getElementById('dateCashFlowDetail') = event.target.dataset.date
            document.getElementById('rangeCertaintyDate') = event.target.dataset.dateCertainty
            document.getElementById('typeIdCashFlowDetail') = event.target.dataset.typeId
        })        
    })
}

/* Event listeners */

document.getElementById('btnAddEvent').addEventListener('click', () => {
    document.getElementById('asideCashFlowDetails').classList.toggle('hidden')
})

document.getElementById('btnSaveCashFlowDetail').addEventListener('click', () => {
    createEvent('draft')
    document.getElementById('asideCashFlowDetails').classList.toggle('hidden')
})

document.getElementById('btnSubmitCashFlowDetail').addEventListener('click', () => {
    console.log('clicked Submit')
    createEvent('submitted')
    document.getElementById('asideCashFlowDetails').classList.toggle('hidden')
})