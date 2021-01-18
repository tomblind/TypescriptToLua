import * as ts from "typescript";
import * as path from "path";

export enum ExtensionKind {
    MultiFunction = "MultiFunction",
    MultiType = "MultiType",
    OperatorAddType = "OperatorAddType",
    OperatorAddMethodType = "OperatorAddMethodType",
}

function isSourceFileFromLanguageExtensions(sourceFile: ts.SourceFile): boolean {
    const extensionDirectory = path.resolve(__dirname, "../../../language-extensions");
    const sourceFileDirectory = path.dirname(path.normalize(sourceFile.fileName));
    return extensionDirectory === sourceFileDirectory;
}

export function getExtensionKind(declaration: ts.Declaration): ExtensionKind | undefined {
    const sourceFile = declaration.getSourceFile();
    if (isSourceFileFromLanguageExtensions(sourceFile)) {
        if (ts.isFunctionDeclaration(declaration) && declaration?.name?.text === "$multi") {
            return ExtensionKind.MultiFunction;
        }

        if (ts.isTypeAliasDeclaration(declaration)) {
            switch (declaration.name.text) {
                case "MultiReturn":
                    return ExtensionKind.MultiType;
                case "OperatorAdd":
                    return ExtensionKind.OperatorAddType;
                case "OperatorAddMethod":
                    return ExtensionKind.OperatorAddMethodType;
            }
        }

        throw new Error("Unknown extension kind");
    }
}
