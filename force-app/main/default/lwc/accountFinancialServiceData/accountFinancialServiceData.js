import { LightningElement,track } from 'lwc';
import fetchAccounts from '@salesforce/apex/FinancialServicesDataController.fetchAccounts';

import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [ 
    { label: 'Name', fieldName: 'Name', editable: true, sortable:"true"  }, 
    { label: 'Owner', fieldName: 'Owner.Name', sortable:"true" },
	{ label: 'Industry', fieldName: 'Industry', editable: true  },
	{ label: 'Phone', fieldName: 'Phone', editable: true  },
	{ label: 'AnnualRevenue', fieldName: 'AnnualRevenue', editable: true  }
	
];

export default class accountFinancialServiceData extends LightningElement {
    @track financialAccData;
    @track error; 
    @track columns = columns;
    @track sortBy;
    @track sortDirection;
    @track draftValues = [];
    handleKeyChange( event ) { 
        
            fetchAccounts()   
            .then(result => { 
                this.financialAccData = result; 
                // console.log('>>>',this.financialAccData);
                
            }) 
            .catch(error => { 
                this.error = error; 
            }); 
        } 

    handleSave(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
   
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
       
        Promise.all(promises).then(financialAccData => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'All financialAccData updated',
                    variant: 'success'
                })
            );
             // Clear all draft values
             this.draftValues = [];
   
             
             return refreshApex(this.financialAccData);
        }).catch(error => {
            // Handle error
        });
    }
    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }
    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.financialAccData));
        let keyValue = (a) => {
            return a[fieldname];
        };
        
        let isReverse = direction === 'asc' ? 1: -1;
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        this.financialAccData = parseData;
    }

}