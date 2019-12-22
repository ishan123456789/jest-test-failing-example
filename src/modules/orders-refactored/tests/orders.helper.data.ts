export const exampleOrder = {
    internalId: "1765123",
    externalId: "x7u-6h3",
    platform: "foodora",
    brand: "babanoni",
    outletIdentifier: "au_vienna_wallensteinstr",
    receivedAt: "",
    orderedAt: "",
    expiresAt: "",
    locale: {
        countryCode: "AT",
        currencyCode: "EUR",
        currencySymbol: "€",
    },
    customer: {
        firstName: "Test",
        lastName: "Test",
        salutation: "Mr",
        phone: "+431234567890",
        phoneAccessCode: "",
        email: "customer@clubkitchen.at",
        isVIP: false,
        id: "",
        billing: {
            street: "",
            houseNumber: "",
            company: "",
            postCode: "",
            city: "",
            staircase: "",
            floor: "",
            door: "",
        },
    },
    delivery: {
        mode: "delivery",
        type: "regular",
        expectedDeliveryTime: "",
        expectedDispatchTime: "",
        confirmedTime: "",
        confirmedMinutes: "60",
        instructions: "Please call on arrival",
        address: {
            firstName: "Test",
            lastName: "Test",
            salutation: "Mr",
            phone: "+431234567890",
            phoneAccessCode: "",
            street: "",
            houseNumber: "",
            company: "",
            postCode: "",
            city: "",
            staircase: "",
            floor: "",
            door: "",
            lat: "",
            lng: "",
        },
        tracking: {
            system: "honestood",
            id: "123454",
            path: "cmfeHmgzbBnUq]nKyv@oKxv@??",
        },
    },
    comment: "I am allergic to tomatoes",
    status: {
        current: "dispatched",
        timeline: [
            {
                status: "received",
                occurredAt: "",
            },
            {
                status: "accepted",
                occurredAt: "",
            },
            {
                status: "delayed",
                freshdesk: "1234",
                occurredAt: "",
            },
            {
                status: "dispatched",
                occurredAt: "",
            },
        ],
    },
    payment: {
        method: "cash",
        status: "paid",
        reference: "1DSA331DHJ",
    },
    taxClasses: [
        {
            name: "A",
            rate: "10",
            totalGross: 110,
            totalNet: 100,
        },
        {
            name: "B",
            rate: "20",
            totalGross: 120,
            totalNet: 100,
        },
    ],
    price: {
        totalNet: 200,
        totalGross: 230,
        shippingNet: 50,
        shippingGross: 60,
        shippingTaxClass: "B",
    },
    items: [
        {
            name: "Chipotle Chicken Burrito",
            taxClass: "A",
            priceNet: 100,
            priceGross: 110,
            code: "SW1234",
            instructions: "Without Onions",
            quantity: 1,
            type: "product",
            topups: [
                {
                    name: "Tamato-Avocado-Salsa",
                    code: "SW4567",
                    taxClass: "A",
                    priceNet: 50,
                    priceGross: 55,
                    quantity: 1,
                    type: "non-modifying",
                },
            ],
        },
    ],
    cancellation: {
        occurredAt: "",
        initiatedBy: "",
        reason: "",
        responsible: "",
        comment: "",
    },
    remake: {
        occurredAt: "",
        initiatedBy: "",
        reason: "",
        responsible: "",
        comment: "",
        referenceOrder: "",
    },
};

export const exampleOrderWithValidDelivery = {
    ...exampleOrder,
    delivery: {
        ...exampleOrder.delivery,
        expectedDeliveryTime: new Date(2020, 5, 27, 13, 0, 0),
        expectedDispatchTime: new Date(2020, 5, 27, 13, 0, 0),
    },
};

export const exampleOrderDiffPlatform = {
    ...exampleOrder,
    platform: "mjam",
    delivery: {
        ...exampleOrder.delivery,
        expectedDeliveryTime: new Date(2020, 5, 27, 13, 0, 0).toISOString(),
        expectedDispatchTime: new Date(2020, 5, 27, 13, 0, 0).toISOString(),
    },
};

const exampleOrderWithLateDelivery = {
    ...exampleOrder,
    delivery: {
        ...exampleOrder.delivery,
        expectedDeliveryTime: new Date(2020, 5, 27, 12, 0, 0),
        expectedDispatchTime: new Date(2020, 5, 27, 12, 0, 0),
    },
    status: {
        ...exampleOrder.status,
        timeline: exampleOrder.status.timeline.filter(
            i => i.status !== "dispatched",
        ),
    },
};
delete exampleOrderWithLateDelivery.cancellation;
export { exampleOrderWithLateDelivery };
