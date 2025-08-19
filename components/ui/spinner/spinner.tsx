import styles from "./spinner.module.css";

interface SpinnerProps {
    size?: number;
}

const Spinner = ({size = 40}: SpinnerProps) => (
    <div className={styles.loaderWrapper} style={{width: size, height: size}}>
        <div
            className={styles.loaderRing}
            style={{width: size - 4, height: size - 4, borderWidth: size / 10}}
        />
    </div>
);

export default Spinner;
