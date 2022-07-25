import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { product } from '../../models/Product'
import styles from '../../styles/PickedRank.module.css'

const Item: NextPage<{ data: product }> = React.memo(({ data }) => {
    return (
        <div className={styles.content}>
            <Link href={`/product?_id=${data._id}`} passHref>
                <div className={styles.lList}>
                    <div className={styles.thumb}>
                        <img className={styles.imageUrl} src={data.thumbnailUrl[0]}></img>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.name}>{data.name.replaceAll(/<\/*b>/gi, "")}</div>
                        <div className={styles.price}>
                            <strong>{data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</strong>원
                        </div>
                    </div>
                </div>
            </Link>
        </div >
    )
})

const PickRank: NextPage<{ data: Array<product> }> = React.memo(({ data }) => {
    return (
        <div className={styles.style}>
            <div>
                <div className={styles.category}>BEST 5</div>
            </div>
            <div className={styles.item}>
                {data.map(product => <Item key={product._id} data={product}></Item>)}
            </div>
        </div>
    )
})

export default PickRank