import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox-next";
import { PaletteTree } from "./palette";
import LoginForm from "@/app/ui/login-form";
import Page from "@/app/page";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/LoginForm">
                <LoginForm/>
            </ComponentPreview>
            <ComponentPreview path="/Page">
                <Page/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;