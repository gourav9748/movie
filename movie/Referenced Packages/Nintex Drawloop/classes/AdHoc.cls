/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class AdHoc {
    global AdHoc() {

    }
global virtual class Attachment {
    global Boolean isSelected {
        get;
        set;
    }
    global Attachment(Id recordId, String fileName, String displayType) {

    }
}
global interface IAttachmentManager {
}
global class VeevaVaultAttachment extends Loop.AdHoc.CaseAttachment {
    global VeevaVaultAttachment(Id recordId, Id caseId, String vaultId, String fileName, String mimeType, String displayType, String articleTitle, String downloadURL) {

    }
}
}
