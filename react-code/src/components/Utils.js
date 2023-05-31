import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DraftsIcon from '@mui/icons-material/Drafts';
import VideoFileOutlinedIcon from '@mui/icons-material/VideoFileOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import InsertPageBreakOutlinedIcon from '@mui/icons-material/InsertPageBreakOutlined';

export const typesTyples = [
    {
        fileExtension: "docx", 
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        image: <DraftsIcon/>
    },
    {
        fileExtension: "doc", 
        mimeType: 'application/msword',
        image: <DraftsIcon/>
    },
    {
        fileExtension: "pdf", 
        mimeType: 'application/pdf',
        image: <PictureAsPdfOutlinedIcon/>
    },
    {
        fileExtension: "ppt", 
        mimeType: 'application/vnd.ms-powerpoint',
        image: <DocumentScannerOutlinedIcon/>
    },
    {
        fileExtension: "pptx", 
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        image: <DocumentScannerOutlinedIcon/>
    },
    {
        fileExtension: "rar", 
        mimeType: 'application/vnd.rar',
        image: <ArchiveOutlinedIcon/>
    },
    {
        fileExtension: "txt", 
        mimeType: 'text/plain',
        image: <TextSnippetOutlinedIcon/>
    },
    {
        fileExtension: "xls", 
        mimeType: 'application/vnd.ms-excel',
        image: <InsertPageBreakOutlinedIcon/>
    },
    {
        fileExtension: "xlsx", 
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        image: <InsertPageBreakOutlinedIcon/>
    },
    {
        fileExtension: "zip", 
        mimeType: 'application/zip',
        image: <ArchiveOutlinedIcon/>
    },
    {
        fileExtension: "png", 
        mimeType: 'image/png',
        image: <ImageOutlinedIcon/>
    },
    {
        fileExtension: "jpg", 
        mimeType: 'image/jpeg',
        image: <ImageOutlinedIcon/>
    },
    {
        fileExtension: "mp4", 
        mimeType: 'video/mp4',
        image: <VideoFileOutlinedIcon/>
    },
    {
        fileExtension: "mpeg", 
        mimeType: 'video/mpeg',
        image: <VideoFileOutlinedIcon/>
    },
];

export const unique = (arr) => {
    var map = new Map();
    let uniqueObjects = arr.filter((item) => {
      if (map.get(item.id)) {
        return false;
      }
  
      map.set(item.id, item);
      return true;
    });
  
    return uniqueObjects;
}

export const changer = (str) => {
    let temp = str.lastIndexOf(':');
    let sub = str.substring(temp + 1);
    let neww = sub.replaceAll(',', '.');
    return str.split(sub).join(neww);
}

export const monthsArr = [{ productName: "январь" }, { productName: "февраль" }, { productName: "март" },
{ productName: "апрель" }, { productName: "май" }, { productName: "июнь" },
{ productName: "июль" }, { productName: "август" }, { productName: "сентябрь" },
{ productName: "октябрь" }, { productName: "ноябрь" }, { productName: "декабрь" }]