var parentFolderID = "1gbHOmz3WOMBWSJEDGEKSJD5hfoH5s5Ag" //CHANGE THIS:this is the parent directory where all the folders are kept
var nameIndex = 2 //CHANGE THIS: this is the form entry of the students name. if the name is the second entry in the form, this should equal 2
var suffix = "-log" //OPTIONAL this denotes the suffix appended to the documentation file name. By default the spreasheet is named "<Student Name>-log"

/** on form submit, adds an entry to the corresponding folder if one exists
 *  if folder does not exist, creates a new folder and new spreadsheet
 *  Then adds an entry into spreadsheet, corresponding to the responses in the form
*/ 
function onSubmit(e) {
  
  //get the name of the student from submitted form
  var name = e.values[nameIndex];
  
  //check if folder exists
  var parentFolder = DriveApp.getFolderById(parentFolderID);
  var subFolders = parentFolder.getFolders();
  var doesntExist = true;
  
  // Check if folder already exists.
  while(subFolders.hasNext()){
    var folder = subFolders.next();
    
    //If the name exists return the id of the folder
    if(folder.getName() === name){
      doesntExist = false;
      var sheet = SpreadsheetApp.open(folder.getFilesByName(name.concat(suffix)).next());
    }
  }
  //If the name doesn't exist, then create a new folder and new spreadsheet
  if(doesntExist == true){
    //If the file doesn't exist
    var newFolder = parentFolder.createFolder(name);
    Drive.Files.insert({mimeType: MimeType.GOOGLE_SHEETS, title: name.concat(suffix), parents: [{id: newFolder.getId()}]});
    var sheet = SpreadsheetApp.open(newFolder.getFilesByName(name.concat(suffix)).next());
  }
  
  //add new entry to log
  sheet.appendRow(e.values);
}
