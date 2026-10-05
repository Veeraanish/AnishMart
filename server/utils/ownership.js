function canManageProduct(
    user,
    sellerId
) {

    if (!user) {
        return false;
    }

    if (user.role === "admin") {
        return true;
    }

    if (user.role !== "seller") {
        return false;
    }

    return (
        Number(user.id) ===
        Number(sellerId)
    );
}

module.exports = {
    canManageProduct
};