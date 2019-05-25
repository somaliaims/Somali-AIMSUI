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
            canEditSector: false,
            canEditProject: true,
            canEditYear: false,
            canDoSMTPSettings: false,
            canDoIATISettings: false,
            canEditEnvelope: true,
            canEditCustomFields: false,
            canEditFundingType: false,
            canEditEmailMessage: false,
            canEditNotifications: true,
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
            canDoIATISettings: true,
            canEditEnvelope: true,
            canEditCustomFields: true,
            canEditFundingType: true,
            canEditEmailMessage: true,
            canEditNotifications: true,
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
            canDoIATISettings: true,
            canEditEnvelope: true,
            canEditCustomFields: true,
            canEditFundingType: true,
            canEditEmailMessage: true,
            canEditNotifications: true,
        },
        guest: {
            canManage: false,
            canEditCurrency: false,
            canEditOrganization: false,
            canEditLocation: false,
            canEditSectorType: false,
            canEditSectorCategory: false,
            canEditSectorSubCategory: false,
            canEditSector: false,
            canEditProject: false,
            canEditYear: false,
            canDoSMTPSettings: false,
            canDoIATISettings: false,
            canEditEnvelope: true,
            canEditCustomFields: false,
            canEditFundingType: false,
            canEditEmailMessage: false,
            canEditNotifications: false
        }
    },
    customFieldTypes: [
        {
            'typeId': null,
            'field': '--Select One--'
        },
        {
            'typeId': 1,
            'field': 'Dropdown'
        },
        {
            'typeId': 2,
            'field': 'Checkbox'
        },
        {
            'typeId': 3,
            'field': 'Text'
        },
        {
            'typeId': 4,
            'field': 'Radio'
        },

    ],
}