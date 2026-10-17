import GlobalIndex from "../../../components/modal/Read";

export default function PricelistIndex() {

    const fields = [
        {
            name: 'title',
            type: 'text',
            label: 'title',
            placeholder: 'Input Title Here!',
        },
        {
            name: 'description',
            type: 'text',
            label: 'description',
            placeholder: 'Input Description Here!',
        },
        {
            name: 'max_capacity',
            type: 'number',
            label: 'Max Capacity',
            placeholder: 'Input Max Capacity Here!',
        },
        {
            name: 'min_capacity',
            type: 'number',
            label: 'min_capacity',
            placeholder: 'Input Min Capacity Here!',
        },
        {
            name: 'weekday_price',
            type: 'number',
            label: 'Weekday Price',
            placeholder: 'Input Weekday Price Here!',
        },
        {
            name: 'weekend_price',
            type: 'number',
            label: 'Weekend Price',
            placeholder: 'Input Weekend Price Here!',
        },
        {
            name: 'long_weekend_price',
            type: 'number',
            label: 'Long Weekend Price',
            placeholder: 'Input Long Weekend Price Here!',
        },
        {
            name: 'high_season_price',
            type: 'number',
            label: 'High Season Price',
            placeholder: 'Input High Season Price Here!',
        }
    ]

    return (
        <GlobalIndex path={'pricelists'} title={'Pricelists'} subtitle={'Kelola daftar harga.'} tableHead={['title', 'description', 'max_capacity', 'max_capacity', 'weekday_price', 'weekend_price', 'long_weekday_price', 'high_season_price']} fields={fields} is_paginate={true}/>
    )
}