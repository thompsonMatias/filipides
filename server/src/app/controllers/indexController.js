const index = (req, res) => res.redirect(`/${process.env.ENDPOINT_PATH}/${process.env.APP_PATH}/`);

const healthCheck = (req, res) => res.send({status: "ok"});

module.exports = {
    index,
    healthCheck,
};
