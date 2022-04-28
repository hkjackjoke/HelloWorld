Tracking = {
    formStep: function (step_name, applicant_type, where_did_you_hear, partner_id, organisation_type, spca_branch, pet_types, application_id) {

        var params = {
            'applicant_type': applicant_type,
            'where_did_you_hear': where_did_you_hear,
            'partner_id': partner_id,
            'organisation_type': organisation_type,
            'spca_branch': spca_branch,
            'pet_types': pet_types,
            'application_id': application_id
        };

        console.log("Track step: " + step_name);
        console.log(params);
        window.dataLayer.push({
            'event': 'pageview',
            'page': {
                'name': step_name,
                'site_section': 'free cover',
                'type': 'application form'
            },
            'free_cover': params
        });
    },
    savePet: function (number) {
        console.log("Track save pet: " + number);
        window.dataLayer.push({
            'event': 'submit form',
            'event_info': {
                'category': 'Forms',
                'action': 'submit form',
                'label': 'save pet',
                'label_2': number
            }
        });
    },
    createNew: function () {
        console.log("Track create new application");
        window.dataLayer.push({
            'event': 'CTA click',
            'event_info': {
                'category': 'Forms',
                'action': 'CTA click',
                'label': 'create new application',
                'label_2': undefined
            }
        });
    }
};