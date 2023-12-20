const service_model = (serviceid, service_name, price) => {
    let Service = {
        serviceid: serviceid,
        service_name: service_name,
        price: price
    };

    return Service;
};

module.exports = {
    service_model,
};