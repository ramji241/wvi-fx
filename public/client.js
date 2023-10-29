/* Default certainties based on form category selection */

const defaultCertainties = [
    {
        category: 'Sponsorship',
        eventCertainty: 1,
        amountCertainty: 1,
        dateCertainty: 1
    },
    {
        category: 'Grant',
        eventCertainty: 0.75,
        amountCertainty: 0.75,
        dateCertainty: 0.75
    },
    {
        category: 'Contract',
        eventCertainty: 0.5,
        amountCertainty: 0.75,
        dateCertainty: 0.5
    },
    {
        category: 'Loan',
        eventCertainty: 1,
        amountCertainty: 1,
        dateCertainty: 1
    },
]

/* Class constructor for new cash flow object */

class ObjCashFlow {
    constructor(id, account, direction, category, eventCertainty, amount, amountCertainty, date, dateCertainty, group, requireGroup, eventDescriptor, status) {
        this.id = id;
        this.account = account;
        this.direction = direction;
        this.category = category;
        this.eventCertainty = eventCertainty;
        this.amount = amount;
        this.amountCertainty = amountCertainty;
        this.date = date;
        this.dateCertainty = dateCertainty;
        this.group = group;
        this.requireGroup = requireGroup,
        this.eventDescriptor = eventDescriptor;
        this.status = status
    }
}

/* Creates new object for account; object will be populated with fields from form when user saves or submits */

const addEvent = () => {
    const newEvent = new ObjCashFlow()
    return newEvent
}

/* Either new object or existing object is updated when form is saved or submitted */

const updateEvent = async (form, status) => {
    const tempEvent = (form.dataset.id === '') ? addEvent() : await getEvent(form.dataset.id)

    tempEvent.account = document.getElementById('account').value
    tempEvent.direction = form.direction.value
    tempEvent.category = form.category.value
    tempEvent.eventCertainty = form.eventCertainty.value
    tempEvent.amount = form.amount.value
    tempEvent.amountCertainty = form.amountCertainty.value
    tempEvent.date = form.date.value
    tempEvent.dateCertainty = form.dateCertainty.value
    tempEvent.group = form.group.value === '' ? undefined : form.group.value
    tempEvent.requireGroup = form.requireGroup.checked
    tempEvent.eventDescriptor = form.eventDescriptor.value
    tempEvent.status = (status !== 'draft' && tempEvent.status !== 'draft') ? 'modified' : status;

    if (!form.dataset.id) {
        postEvent(tempEvent)
    } else {
        tempEvent.id = form.dataset.id
        putEvent(tempEvent) 
    }
}

/* If new object, post to database */

const postEvent = async (event) => {
    const headers = {
        "Content-Type": "application/json"
    }

    const body = JSON.stringify(event)
    
    try {
        const res = await fetch('/postEvent', {
            method: 'post',
            headers,
            body,
        })
        const data = await res.json()
        console.log(data)
        window.location.reload()
    } catch (err) {
        console.log(err)
    }
}

/* If existing object, put to database */

const putEvent = async (event) => {
    const headers = {
        "Content-Type": "application/json"
    }

    const body = JSON.stringify(event)

    try {
        const res = await fetch('/putEvent', {
            method: 'put',
            headers,
            body,
        })
        const data = await res.json()
        console.log(data)
        window.location.reload()
    } catch (err) {
        console.log(err)
    }
}

/* Retrieve single event from database */

const getEvent = async (id) => {
    try {
        const res = await fetch('/getEvent?' + new URLSearchParams({'id': id}))
        const data = await res.json()
        return data.selected
    } catch (err) {
        console.log(err)
    }
}

/* Form builder used every time an individual event or group of events is selected */

const buildForm = async (e) => {
    const event = await getEvent(e.id)
    const form = document.getElementById('formEventDetails')
    for (key in event) {
        if (event[key]) {
            switch (key) {
                case '_id':
                    form.dataset.id = event[key]
                    break;
                case 'status':
                    break;
                case 'date':
                    form[key].value = event[key].substring(0,10)
                    break;
                case 'requireGroup':
                    if (event[key]) {
                        form[key].checked = true
                        form['group'].required = true
                        form['group'].disabled = false
                    }
                    break;
                default:
                    form[key].value = event[key]
                    break;
            }
        }
    }

    return form;
}

/* -- Event listeners -- */

/* Add event button */

document.getElementById('btnAddEvent').addEventListener('click', () => {
    document.getElementById('asideEvent').classList.toggle('hidden')
})

/* Cancel button */

document.getElementById('btnCancel').addEventListener('click', () => {
    document.getElementById('asideEvent').classList.toggle('hidden')
})

/* If checkbox to require event group is checked, input beomes required */

document.getElementById('inputRequireGroup').addEventListener('change', (event) => {
    document.getElementById('inputEventGroup').required = event.target.checked
    if (event.target.checked) {
        document.getElementById('inputEventGroup').removeAttribute('disabled')
    } else {
        document.getElementById('inputEventGroup').value = ''
        document.getElementById('inputEventGroup').setAttribute('disabled', true)
    } 
})

/* Save event button in form creates object with status of 'draft'; no approval workflow; value isn't yet actionable */

document.getElementById('btnSaveEvent').addEventListener('click', () => {
    const form = document.getElementById('formEventDetails')
    updateEvent(form, 'draft')
    document.getElementById('asideEvent').classList.toggle('hidden')
})

/* Submit event button in form creates object with status of 'submit', which leads to approval workflow */

document.getElementById('btnSubmitEvent').addEventListener('click', () => {
    const form = document.getElementById('formEventDetails')
    updateEvent(form, 'submitted')
    document.getElementById('asideEvent').classList.toggle('hidden')
})

/* User can edit existing value using form by double-clicking the amount input */

/* User can edit existing amount by simply editing the amount cell; sets status to modified */

const inputAmounts = Array.from(document.getElementsByClassName('inputAmount'))

inputAmounts.forEach(input => {
    input.addEventListener('dblclick', async (event) => {
        document.getElementById('asideEvent').classList.toggle('hidden')
        await buildForm(event.target)
        const btnSaveEvent = document.getElementById('btnSaveEvent')
        btnSaveEvent.id = 'btnModifyEvent'
        btnSaveEvent.innerHTML = 'Modify'
    });
    input.addEventListener('change', async (event) => {
        const form = await buildForm(event)

        if (Number(event.target.value) !== form.amount) {
            form.amount.value = Number(event.target.value)
            updateEvent(form, 'draft')
        }
    })
})

/* User can edit date for all objects that share that date by editing the date cell */

const inputDates = Array.from(document.getElementsByClassName('inputDate'));

inputDates.forEach(input => {
    input.addEventListener('change', async (e) => {
        const eventsToUpdate = [];
        const cellIndex = e.target.closest('td').cellIndex;
        const rows = Array.from(document.getElementById('tbodyEvents').children)
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].cells[cellIndex].querySelector('.inputAmount').id !== '') {    
                eventsToUpdate.push(rows[i].cells[cellIndex].querySelector('.inputAmount'))
            }
        }
        eventsToUpdate.forEach(async (event) => {
            const form = await buildForm(event)

            if (e.target.value !== form.date) {
                form.date.value = e.target.value
                updateEvent(form, 'draft')
            }
        })
    })
})

/* User can edit the category for all objects that share that category by editing the category cell */

const inputCategories = Array.from(document.getElementsByClassName('inputCategory'));

inputCategories.forEach(input => {
    input.addEventListener('change', async (e) => {
        const eventsToUpdate = [];
        const row = e.target.closest('tr')
        for (let i = 2; i < row.cells.length; i++) {
            if (row.cells[i].querySelector('.inputAmount').id !== '') {
                eventsToUpdate.push(row.cells[i].querySelector('.inputAmount'))
            }
        }

        eventsToUpdate.forEach(async (event) => {
            const form = await buildForm(event)

            if (e.target.value !== form.category) {
                form.category.value = e.target.value
                updateEvent(form, 'draft')
            }
        })
    })
})

/* User can edit the group for all objects that share that group by editing the group cell */

const inputGroups = Array.from(document.getElementsByClassName('inputGroup'));

inputGroups.forEach(input => {
    input.addEventListener('change', async (e) => {
        const eventsToUpdate = [];
        const row = e.target.closest('tr')
        for (let i = 2; i < row.cells.length; i++) {
            if (row.cells[i].querySelector('.inputAmount').id !== '') {
                eventsToUpdate.push(row.cells[i].querySelector('.inputAmount'))
            }
        }

        eventsToUpdate.forEach(async (event) => {
            const form = await buildForm(event)

            if (e.target.value !== form.group) {
                form.group.value = e.target.value
                updateEvent(form, 'draft')
            }
        })
    })
})

/* Update certainties for new form event based on category selection */

document.getElementById('inputEventCategory').addEventListener('change', (event) => {
    defaultCertainties.forEach(type => {
        if (type.category === event.target.value) {
            document.getElementById('rangeEventCertainty').value = type.eventCertainty
            document.getElementById('rangeAmountCertainty').value = type.amountCertainty
            document.getElementById('rangeDateCertainty').value = type.dateCertainty
        }
    })
})