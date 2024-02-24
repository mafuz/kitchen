import styles from "./Card1.module.scss";

function Card1({children, cardClass}) {
  return (
    <div className={`${styles.card1} ${cardClass}`}>
        {children}
        </div>
  )
}

export default Card1