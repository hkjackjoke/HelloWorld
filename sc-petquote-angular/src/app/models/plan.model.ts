export class Plan {
    public name = '';
    public displayname = '';
    public premium = 0;
    public premiumplus = 0;
    public discount = 0;
    public total = 0;
    public selectedLimit = 3;
    public petindex;

    public coPayment = 0;
    public extras = {};
    public discounts = [];
    public initialised = 0;

    public primaryfields = [
        'name',
        'displayname',
        'premium',
        'premiumplus',
        'discount',
        'total',
        'selectedLimit',
        'coPayment',
        'extras',
        'discounts',
    ];
    public options = {
        accipet: {
            petindex: null,
            name: 'accipet',
            displayname: 'Accipet',
            premium: 0,
            premiumplus: 0,
            discount: 0,
            total: 0,
            selectedLimit: 1,
            coPayment: 1,
            extras: {},
            discounts: []
        },
        petcare: {
            petindex: null,
            name: 'petcare',
            displayname: 'PetCare',
            premium: 0,
            premiumplus: 0,
            discount: 0,
            total: 0,
            selectedLimit: 1,
            coPayment: 1,
            extras: { dayToDayCare: 0 , dentalCare: 0 },
            discounts: []
        },
    };
    public charges = {
        petcare: {
            premium: {
                0: 40.35,
                1: 55.35,
                2: 74.85,
                3: 87.35,
            },
            limits: {
                0: 5,
                1: 10,
                2: 15,
                3: 20,
            },
            limitsArray: [
                0,
                1,
                2,
                3,
            ],
            extras: {
                dayToDayCare : 5,
                dentalCare : 12.5,
            },
            coPayment: 20
        },
        accipet: {
            premium: {
                0: 40.35,
                1: 55.35,
                2: 60.35,
                3: 74.85,
            },
            limits: {
                0: 5,
                1: 10,
                2: 15,
                3: 20,
            },
            limitsArray: [
                0,
                1,
                2,
                3,
            ],
            extras: {
            },
            coPayment: 20
        }
    };
    public discountconfig = {
        multi: {
            abrev: '-5% additional pet',
            label: 'Additional pet discount - 5%',
            listtext: '5% discount for insuring additional pets',
            amount: 5,
        },
        directdebit: {
            abrev: '-2.5% direct debit',
            label: 'Direct debit discount - 2.5%',
            listtext: '2.5% discount for using direct debit',
            amount: 2.5,
        },
        coPayment: {
            abrev: '20% co payment',
            label: 'Co payment discount - 20%',
            listtext: '20% co payment discount',
            amount: 20,
        },
        schsMember: {
            abrev: '-2.5% SCHS member',
            label: 'SCHS member discount - 2.5%',
            listtext: '2.5% dicsount for SCHS member',
            amount: 2.5,
        }
    };
    selectPlan(plan: string, initialise: boolean = false) {
        for (const field in this.options[plan]) {
            if (this.primaryfields.indexOf(field) !== -1) {
                this[field] = this.options[plan][field];
            }
        }
        if (initialise) {
            this.initialised = 1;
        }
    }
    selectLimit(plan: string, value: any): void {
        if (value === '' || value === null) {
            return;
        }
        this.options[plan].selectedLimit = value;
        this.options[plan].premium = this.charges[plan].premium[value];
        this.updatePlan(plan);
    }
    toggleExtra(plan: string, name: string, value: any) {
        this.options[plan].extras[name] = value;
        this.updatePlan(plan);
    }
    toggleCoPayment(plan: string, value: any) {
        this.options[plan].coPayment = value;
        this.updatePlan(plan);
    }
    updateDiscount(plan: string, value: any, remove: boolean = false) {
      if (this.options[plan] !== undefined) {
        if (remove) {
          delete(this.options[plan].discounts[value]);
        } else {
          this.options[plan].discounts[value] = this.discountconfig[value].amount;
        }
      }
      this.updatePlan(plan);
    }
    updatePlan(plan: string, includediscounts: boolean = false, initialise: boolean = false) {

        if (plan === this.name) {
            this.selectPlan(plan, initialise);
        }
    }
    getpricemod(field: string, value: any) {
        switch (field) {
            case 'coPayment':
                return value + '% removed';
            default:
                return '$' + value.toFixed(2) + ' added';
        }
    }
    setdummydata(plan) {
        this.coPayment = 1;
        if (plan === 'petcare') {
            this.options.petcare.extras.dayToDayCare = 1;
            this.options.petcare.extras.dentalCare = 1;
        }
        this.options[plan].coPayment = 1;
        this.updateDiscount(plan, 'multi');
        this.updateDiscount(plan, 'directdebit');
    }

    getCoPayment(): string {
        if (this.coPayment) {
            return this.charges[this.name].coPayment + '% Co-payment applied';
        }
        return 'N/A';
    }
}
