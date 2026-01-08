import type { ComponentType, ReactNode } from "react";

declare module "framer-motion" {
    export * from "framer-motion/dist/index";
    
    export const motion: {
        div: ComponentType<Record<string, unknown>>;
        span: ComponentType<Record<string, unknown>>;
        p: ComponentType<Record<string, unknown>>;
        button: ComponentType<Record<string, unknown>>;
        a: ComponentType<Record<string, unknown>>;
        ul: ComponentType<Record<string, unknown>>;
        li: ComponentType<Record<string, unknown>>;
        nav: ComponentType<Record<string, unknown>>;
        section: ComponentType<Record<string, unknown>>;
        article: ComponentType<Record<string, unknown>>;
        header: ComponentType<Record<string, unknown>>;
        footer: ComponentType<Record<string, unknown>>;
        main: ComponentType<Record<string, unknown>>;
        aside: ComponentType<Record<string, unknown>>;
        img: ComponentType<Record<string, unknown>>;
        svg: ComponentType<Record<string, unknown>>;
        path: ComponentType<Record<string, unknown>>;
        circle: ComponentType<Record<string, unknown>>;
        rect: ComponentType<Record<string, unknown>>;
        g: ComponentType<Record<string, unknown>>;
        h1: ComponentType<Record<string, unknown>>;
        h2: ComponentType<Record<string, unknown>>;
        h3: ComponentType<Record<string, unknown>>;
        h4: ComponentType<Record<string, unknown>>;
        h5: ComponentType<Record<string, unknown>>;
        h6: ComponentType<Record<string, unknown>>;
        form: ComponentType<Record<string, unknown>>;
        input: ComponentType<Record<string, unknown>>;
        textarea: ComponentType<Record<string, unknown>>;
        label: ComponentType<Record<string, unknown>>;
        table: ComponentType<Record<string, unknown>>;
        tbody: ComponentType<Record<string, unknown>>;
        tr: ComponentType<Record<string, unknown>>;
        td: ComponentType<Record<string, unknown>>;
        th: ComponentType<Record<string, unknown>>;
    };
    
    export const AnimatePresence: ComponentType<{
        children?: ReactNode;
        mode?: "sync" | "wait" | "popLayout";
        initial?: boolean;
        onExitComplete?: () => void;
    }>;
}
