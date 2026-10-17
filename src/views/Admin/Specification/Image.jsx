import GlobalIndex from "../../../components/modal/Read";

export default function ImageSpecification() {

    const fields = [
        {
            name: 'image1',
            type: 'file',
            label: 'Image 1',
            placeholder: 'Input First Here!',
        },
        {
            name: 'image2',
            type: 'file',
            label: 'Image 2',
            placeholder: 'Input Second Here!',
        },
        {
            name: 'image3',
            type: 'file',
            label: 'Image 3',
            placeholder: 'Input Third Here!',
        },
    ]

    return (
        <GlobalIndex path={'specification-gallery'} title={'Gambar Spesifikasi'} subtitle={'Kelola daftar gambar spesifikasi.'} tableHead={['image1', 'image2', 'image3']} fields={fields} is_paginate={true} isCard={true} imageSpecification={true}/>
    )
}