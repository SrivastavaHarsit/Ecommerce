//coupon model
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//coupon is expired
CouponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

CouponSchema.virtual("daysLeft").get(function () {
  const daysLeft =
    Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24)) +
    " " +
    "Days left";
  return daysLeft;
});

//validation (saving data se before chalega (pre))
// Validation middleware: These are pre-validation middleware functions that are executed before the validate operation. They check various conditions and, if any condition is not met, they invoke the next function with an error.
// The first validation checks if endDate is less than startDate.
// The second validation checks if startDate is less than the current date.
// The third validation checks if endDate is less than the current date.
// The fourth validation checks if the discount is within the valid range (greater than 0 and less than or equal to 100).

CouponSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date cannot be less than the start date"));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.startDate < Date.now()) {
    next(new Error("Start date cannot be less than today"));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.endDate < Date.now()) {
    next(new Error("End date cannot be less than today"));
  }
  next();
});

CouponSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(new Error("Discount cannot be less than 0 or greater than 100"));
  }
  next();
});

const Coupon = mongoose.model("Coupon", CouponSchema);

export default Coupon;