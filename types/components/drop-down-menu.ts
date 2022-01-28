interface Option {
    title: string;
    todo: any;
    hoverBgColor: string;
    hoverTextColor: string;
}

type PageData = {
    name: string;
    options: Array<Option>
}

export type {
    PageData,
    Option
}