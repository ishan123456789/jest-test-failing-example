import { arrayProp, getModelForClass, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import * as yup from "yup";
import {
    Cancellation,
    Customer,
    Delivery,
    Item,
    Locale,
    Payment,
    Price,
    Remake,
    Status,
    TaxClass,
} from "./order.additional.interface";

export class Order {
    @prop()
    internalId?: string;
    @prop()
    externalId?: string;
    @prop()
    platform?: string;
    @prop()
    brand?: string;
    @prop()
    outletIdentifier?: string;
    @prop()
    receivedAt?: string;
    @prop()
    orderedAt?: string;
    @prop()
    expiresAt?: string;
    @prop()
    locale?: Locale;
    @prop()
    customer?: Customer;
    @prop()
    delivery?: Delivery;
    @prop()
    comment?: string;
    @prop()
    status?: Status;
    @prop()
    payment?: Payment;
    @arrayProp({ items: TaxClass })
    taxClasses?: TaxClass[];
    @prop()
    price?: Price;
    @arrayProp({ items: Item })
    items?: Item[];
    @prop()
    cancellation?: Cancellation;
    @prop()
    remake?: Remake;
}
export class OrderFromDB extends Order {
    _id!: ObjectId;
    [key: string]: any;
}

export const QueryValidationSchema = yup.object().shape({
    search: yup.string(),
    limit: yup.number().integer(),
    page: yup.number().integer(),
    sort: yup.string(),
    sortOrder: yup.number().integer(),
    isCurrentDaySearch: yup.bool(),
});
export const OrderValidationSchema = yup.object().shape({
    internalId: yup.string(),
    externalId: yup.string(),
    platform: yup.string(),
    brand: yup.string(),
    outletIdentifier: yup.string(),
    receivedAt: yup.string(),
    orderedAt: yup.string(),
    expiresAt: yup.string(),
    locale: yup.object().shape({
        countryCode: yup.string(),
        currencyCode: yup.string(),
        currencySymbol: yup.string(),
    }),
    customer: yup.object().shape({
        firstName: yup.string(),
        lastName: yup.string(),
        salutation: yup.string(),
        phone: yup.string(),
        phoneAccessCode: yup.string(),
        email: yup.string(),
        isVIP: yup.bool(),
        id: yup.string(),
        billing: yup.object().shape({
            street: yup.string(),
            houseNumber: yup.string(),
            company: yup.string(),
            postCode: yup.string(),
            city: yup.string(),
            staircase: yup.string(),
            floor: yup.string(),
            door: yup.string(),
        }),
    }),
    delivery: yup.object().shape({
        mode: yup.string(),
        type: yup.string(),
        expectedDeliveryTime: yup.string(),
        expectedDispatchTime: yup.string(),
        confirmedTime: yup.string(),
        confirmedMinutes: yup.string(),
        instructions: yup.string(),
        address: yup.object().shape({
            firstName: yup.string(),
            lastName: yup.string(),
            salutation: yup.string(),
            phone: yup.string(),
            phoneAccessCode: yup.string(),
            street: yup.string(),
            houseNumber: yup.string(),
            company: yup.string(),
            postCode: yup.string(),
            city: yup.string(),
            staircase: yup.string(),
            floor: yup.string(),
            door: yup.string(),
            lat: yup.string(),
            lng: yup.string(),
        }),
        tracking: yup.object().shape({
            system: yup.string(),
            id: yup.string(),
            path: yup.string(),
        }),
    }),
    comment: yup.string(),
    status: yup.object().shape({
        current: yup.string(),
        timeline: yup.array().of(
            yup.object().shape({
                status: yup.string(),
                occurredAt: yup.string(),
            }),
        ),
    }),
    payment: yup.object().shape({
        method: yup.string(),
        status: yup.string(),
        reference: yup.string(),
    }),
    taxClasses: yup.array().of(
        yup.object().shape({
            name: yup.string(),
            rate: yup.string(),
            totalGross: yup.number().integer(),
            totalNet: yup.number().integer(),
        }),
    ),
    price: yup.object().shape({
        totalNet: yup.number().integer(),
        totalGross: yup.number().integer(),
        shippingNet: yup.number().integer(),
        shippingGross: yup.number().integer(),
        shippingTaxClass: yup.string(),
    }),
    items: yup.array().of(
        yup.object().shape({
            name: yup.string(),
            taxClass: yup.string(),
            priceNet: yup.number().integer(),
            priceGross: yup.number().integer(),
            code: yup.string(),
            instructions: yup.string(),
            quantity: yup.number().integer(),
            type: yup.string(),
            topups: yup.array().of(
                yup.object().shape({
                    name: yup.string(),
                    code: yup.string(),
                    taxClass: yup.string(),
                    priceNet: yup.number().integer(),
                    priceGross: yup.number().integer(),
                    quantity: yup.number().integer(),
                    type: yup.string(),
                }),
            ),
        }),
    ),
    cancellation: yup.object().shape({
        occurredAt: yup.string(),
        initiatedBy: yup.string(),
        reason: yup.string(),
        responsible: yup.string(),
        comment: yup.string(),
    }),
    remake: yup.object().shape({
        occurredAt: yup.string(),
        initiatedBy: yup.string(),
        reason: yup.string(),
        responsible: yup.string(),
        comment: yup.string(),
        referenceOrder: yup.string(),
    }),
});

export const OrderModel = getModelForClass(Order, {
    schemaOptions: { timestamps: true, strict: false },
});
