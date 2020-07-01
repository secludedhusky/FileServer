export default {
    navigate: (page) => {
        if (this.$router.history.current.name !== page) {
            this.$router.push(page);
        }
    }
}