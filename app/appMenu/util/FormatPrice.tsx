export const FormatPrice = (amount: number) => {
    return new Intl.NumberFormat 
    ('en-PH',{
        style: 'currency',
        currency: 'PHP'
    }).format(amount);
};