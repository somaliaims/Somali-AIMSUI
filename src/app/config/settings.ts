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
            canEditLocation: false,
            canEditSectorType: false,
            canEditSectorCategory: false,
            canEditSectorSubCategory: false,
            canEditProjects: true,
            canDoSMTPSettings: false,
            canDoIATISettings: false
        },
        manager: {
            canEditLocation: true,
            canEditSectorType: true,
            canEditSectorCategory: true,
            canEditSectorSubCategory: true,
            canEditProjects: true,
            canDoSMTPSettings: true,
            canDoIATISettings: true
        },
        superAdmin: {
            canEditLocation: true,
            canEditSectorType: true,
            canEditSectorCategory: true,
            canEditSectorSubCategory: true,
            canEditProjects: true,
            canDoSMTPSettings: true,
            canDoIATISettings: true
        },
        guest: {
            canEditLocation: false,
            canEditSectorType: false,
            canEditSectorCategory: false,
            canEditSectorSubCategory: false,
            canEditProjects: false,
            canDoSMTPSettings: false,
            canDoIATISettings: false
        }
    }
}