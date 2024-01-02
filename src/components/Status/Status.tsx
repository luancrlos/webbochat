import styles from './Status.module.css'

interface StatusProps {
    status: boolean
}

const Status = ({ status }: StatusProps) => {
    return (
        <div className={styles.status}>
            <span className={styles.dot} style={{ backgroundColor: status ? 'green' : 'gray'}}></span>
            <label>{status ? 'Online' : 'Offline'}</label>
        </div>
    );
}

export default Status;