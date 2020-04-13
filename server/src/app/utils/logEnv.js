const setCategory = (category) => process.env.NODE_ENV === 'production' ? category : 'console';

module.exports = {
    setCategory,
};
