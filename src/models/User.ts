import mongoose, { type Model, Schema } from "mongoose";

interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  payment: {
    cardNumber: string;
    expiresAt: Date;
  };
}

interface IVirtuals {
  fullName: string;
  isPro: boolean;
}

interface IMethods {
  comparePassword(password: string): Promise<boolean>;
}

type TQueryHelpers = {};

interface IUserModel extends Model<IUser, TQueryHelpers, IMethods, IVirtuals> {
  isAdmin(email: string): Promise<boolean>;
  createWithFullName(name: string): Promise<UserDoc>;
}

const schema = new Schema<IUser, IUserModel, IMethods, TQueryHelpers, IVirtuals>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  payment: {
    cardNumber: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
});

schema
  .virtual("fullName")
  .get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
  })
  .set((value: string, _virtual, doc) => {
    const [firstName, lastName] = value.split(" ");
    doc.firstName = firstName;
    doc.lastName = lastName;
  });

schema.virtual("isPro").get(function () {
  if (this.payment.expiresAt) {
    const expriresAt = this.payment.expiresAt.getTime();
    return expriresAt > Date.now();
  }
  return false;
});

schema.method("comparePassword", async function (password: string) {
  return this.password === password;
});

schema.static("isAdmin", async function (email: string) {
  const user = await this.findOne({ email });
  return !!user && user.email === "paulo@example.com";
});

schema.static("createWithFullName", async function (name: string) {
  const [firstName, lastName] = name.split(" ");
  return this.create({ firstName, lastName });
});

export const User = mongoose.model<IUser, IUserModel>("User", schema);

export type UserDoc = InstanceType<typeof User>;
