import mongoose, { model, Schema } from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface product {
    _id?: number,
    name: string,
    price: number,
    category1: string,
    category2: string,
    category3?: string,
    category4?: string,
    thumbnailUrl: string[],
    imageUrl: string[],
    description?: string,
    mallName: string,
    maker: string,
    brand: string,
    viewcount?: number,
    createdAt?: Date
}
const productSchema = new Schema<product>({
    _id: { type: Number },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category1: { type: String, required: true },
    category2: { type: String, required: true },
    category3: { type: String, default: "" },
    category4: { type: String, default: "" },
    thumbnailUrl: { type: [String], default: [] },
    imageUrl: { type: [String], default: [] },
    description: { type: String, default: "", trim: true },
    mallName: { type: String, default: "" },
    maker: { type: String, default: "" },
    brand: { type: String, default: "" },
    viewcount: { type: Number, default: 0 },
    createdAt: { type: Date, default: new Date() }
}, { _id: false })

if (!mongoose.models["product"]) {
    productSchema.plugin(AutoIncrement, { id: 'product_seq' })
}

const Product = mongoose.models['product'] ? model<product>('product') : model<product>('product', productSchema, 'product')
export default Product