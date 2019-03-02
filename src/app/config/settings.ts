export const Settings = {
    secretKey: "XYT!M#U7QER&$$U098!",
    userPermissions: {
        manager: {
            canDo: true,
        }
        ,
        standard: {
            canDo: true
        }
    },
    rowsPerPage: 10,
    displayMessageTime: 10000,
    permissions: {
        standard: {
            canManage: false,
            canEditCurrency: false,
            canEditOrganization: false,
            canEditLocation: false,
            canEditSectorType: false,
            canEditSectorCategory: false,
            canEditSectorSubCategory: false,
            canEditProject: true,
            canEditYear: false,
            canDoSMTPSettings: false,
            canDoIATISettings: false
        },
        manager: {
            canManage: true,
            canEditCurrency: true,
            canEditOrganization: true,
            canEditLocation: true,
            canEditSectorType: true,
            canEditSectorCategory: true,
            canEditSectorSubCategory: true,
            canEditSector: true,
            canEditProject: true,
            canEditYear: true,
            canDoSMTPSettings: true,
            canDoIATISettings: true
        },
        superAdmin: {
            canManage: true,
            canEditCurrency: true,
            canEditOrganization: true,
            canEditLocation: true,
            canEditSectorType: true,
            canEditSectorCategory: true,
            canEditSectorSubCategory: true,
            canEditSector: true,
            canEditProject: true,
            canEditYear: true,
            canDoSMTPSettings: true,
            canDoIATISettings: true
        },
        guest: {
            canManage: false,
            canEditCurrency: false,
            canEditOrganization: false,
            canEditLocation: false,
            canEditSectorType: false,
            canEditSectorCategory: false,
            canEditSectorSubCategory: false,
            canEditProject: false,
            canEditYear: false,
            canDoSMTPSettings: false,
            canDoIATISettings: false
        }
    },
    currencies: [
        'EUR',
        'USD',
        'TL',
        'SOS',
        'GBP',
        'JPY',
        'DKK',
        'SEK',
        'CAD',
        'SDR',
        'UIA',
        'QAR',
        'SAR',
        'TRY',
        'CHF',
        'CNY',
        'NOK',
        'AUD'
    ]
}