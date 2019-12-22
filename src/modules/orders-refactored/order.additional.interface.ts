import { prop } from "@typegoose/typegoose";

export class Locale {
    @prop()
    countryCode?: string;
    @prop()
    currencyCode?: string;
    @prop()
    currencySymbol?: string;
}

export class Billing {
    @prop()
    street?: string;
    @prop()
    houseNumber?: string;
    @prop()
    company?: string;
    @prop()
    postCode?: string;
    @prop()
    city?: string;
    @prop()
    staircase?: string;
    @prop()
    floor?: string;
    @prop()
    door?: string;
}

export class Address {
    @prop()
    firstName?: string;
    @prop()
    lastName?: string;
    @prop()
    salutation?: string;
    @prop()
    phone?: string;
    @prop()
    phoneAccessCode?: string;
    @prop()
    street?: string;
    @prop()
    houseNumber?: string;
    @prop()
    company?: string;
    @prop()
    postCode?: string;
    @prop()
    city?: string;
    @prop()
    staircase?: string;
    @prop()
    floor?: string;
    @prop()
    door?: string;
    @prop()
    lat?: string;
    @prop()
    lng?: string;
}

export class Tracking {
    @prop()
    system?: string;
    @prop()
    id?: string;
    @prop()
    path?: string;
}

export class Timeline {
    @prop()
    status?: string;
    @prop()
    occurredAt?: string;
    @prop()
    freshdesk?: string;
}

export class Payment {
    @prop()
    method?: string;
    @prop()
    status?: string;
    @prop()
    reference?: string;
}

export class TaxClass {
    @prop()
    name?: string;
    @prop()
    rate?: string;
    @prop()
    totalGross?: number;
    @prop()
    totalNet?: number;
}

export class Price {
    @prop()
    totalNet?: number;
    @prop()
    totalGross?: number;
    @prop()
    shippingNet?: number;
    @prop()
    shippingGross?: number;
    @prop()
    shippingTaxClass?: string;
}

export class Item {
    @prop()
    name?: string;
    @prop()
    taxClass?: string;
    @prop()
    priceNet?: number;
    @prop()
    priceGross?: number;
    @prop()
    code?: string;
    @prop()
    instructions?: string;
    @prop()
    quantity?: number;
    @prop()
    type?: string;
    @prop()
    topups?: Topup[];
}

export class Topup {
    @prop()
    name?: string;
    @prop()
    code?: string;
    @prop()
    taxClass?: string;
    @prop()
    priceNet?: number;
    @prop()
    priceGross?: number;
    @prop()
    quantity?: number;
    @prop()
    type?: string;
}

export class Cancellation {
    @prop()
    occurredAt?: string;
    @prop()
    initiatedBy?: string;
    @prop()
    reason?: string;
    @prop()
    responsible?: string;
    @prop()
    comment?: string;
}

export class Remake {
    @prop()
    occurredAt?: string;
    @prop()
    initiatedBy?: string;
    @prop()
    reason?: string;
    @prop()
    responsible?: string;
    @prop()
    comment?: string;
    @prop()
    referenceOrder?: string;
}
export class Status {
    @prop()
    current?: string;
    @prop()
    timeline?: Timeline[];
}
export class Customer {
    @prop()
    firstName?: string;
    @prop()
    lastName?: string;
    @prop()
    salutation?: string;
    @prop()
    phone?: string;
    @prop()
    phoneAccessCode?: string;
    @prop()
    email?: string;
    @prop()
    isVIP?: boolean;
    @prop()
    id?: string;
    @prop()
    billing?: Billing;
}
export class Delivery {
    @prop()
    mode?: string;
    @prop()
    type?: string;
    @prop()
    expectedDeliveryTime?: string;
    @prop()
    expectedDispatchTime?: string;
    @prop()
    confirmedTime?: string;
    @prop()
    confirmedMinutes?: string;
    @prop()
    instructions?: string;
    @prop()
    address?: Address;
    @prop()
    tracking?: Tracking;
}
