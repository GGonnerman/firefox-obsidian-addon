import { CHECK_LIST, TRANSFORMERS } from "@lexical/markdown";
import { FRONTMATTER } from "../Frontmatter/FrontmatterTransformer";
import { IMAGE_TRANSFORMER } from "../Images/ImageTransformer";
import { SMARTLINK } from "../Smartlink/SmartlinkTransformer";

export const EDITOR_TRANSFORMERS = [
    CHECK_LIST,
    IMAGE_TRANSFORMER,
    SMARTLINK,
    FRONTMATTER,
    ...TRANSFORMERS,
]