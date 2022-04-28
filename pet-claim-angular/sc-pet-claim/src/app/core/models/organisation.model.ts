export interface OrganisationModel {
    organisationName: string;
    phoneNumber: string;
    address: string;
    organisationId: number;
}
export const emptyOrganisation = (): OrganisationModel => {
    return {
        organisationName: '',
        phoneNumber: '',
        address: '',
        organisationId: 0
    };
};
