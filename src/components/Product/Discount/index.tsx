import styles from "./index.module.scss";

interface props {
    discount: number;
    className: string;
}

export default function Discount({ discount, className }: props) {
    const lvls = ["none", "small", "medium", "high", "insane"];
    const style = lvls[(discount / 20) ^ 0];
    return (
        <div
            lvl={style}
            className={`${className} 
            aspect-square rounded-full relative text-white text-center
bg-violet-400
            data-[none]:hidden
            }
`}
        >
            <span
                className="
                   text-inherit absolute text-center 
                   bottom-1/2 translate-y-1/2
                   right-1/2 translate-x-1/2
                "
            >
                {discount}%
            </span>
        </div>
    );
}
