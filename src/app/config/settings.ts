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
    dropDownMenus: {
        home: 1,
        entry: 2,
        projects: 3,
        management: 4,
        reports: 5
    },
    dropDownMenusConstants: {
        HOME: 1,
        DATA_ENTRY: 2,
        PROJECTS: 3,
        MANAGEMENT: 4,
        REPORTS: 5
    },
    pdfPrintPageHeight: 1550,
    rowsPerPage: 10,
    yearLimit: 100,
    descriptionLowLimit: 500,
    descriptionMediumLimit: 800,
    descriptionLongLimit: 3000,
    introductionLimit: 1000,
    mediumRowsPerPage: 20,
    displayMessageTime: 10000,
    helpTextLength: 150,
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
            canDoHomePageSettings: false,
            canEditEnvelopeType: false,
            canEditEnvelope: true,
            canEditCustomFields: false,
            canEditFundingType: false,
            canEditEmailMessage: false,
            canEditNotifications: true,
            canEditHelp: false,
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
            canDoHomePageSettings: true,
            canEditEnvelopeType: true,
            canEditEnvelope: true,
            canEditCustomFields: true,
            canEditFundingType: true,
            canEditEmailMessage: true,
            canEditNotifications: true,
            canEditHelp: true,
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
            canDoHomePageSettings: true,
            canEditEnvelopeType: true,
            canEditEnvelope: true,
            canEditCustomFields: true,
            canEditFundingType: true,
            canEditEmailMessage: true,
            canEditNotifications: true,
            canEditHelp: true,
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
            canDoHomePageSettings: false,
            canEditEnvelopeType: false,
            canEditEnvelope: false,
            canEditCustomFields: false,
            canEditFundingType: false,
            canEditEmailMessage: false,
            canEditNotifications: false,
            canEditHelp: false,
        }
    },
    markerTypes: [
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