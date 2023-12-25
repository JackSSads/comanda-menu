const mongoose = require("mongoose");

const Caixa = mongoose.model("Caixa", {
    createdAt: {
        type: Date,
        default: Date.now,
      },
    comandas: [],
    totalValue: Number,
    status: Boolean,
});

module.exports = Caixa;