import { Upload, X } from "lucide-react"
import Image from "next/image"
import { FileInputProps } from ".."

const FileInput = ({ 
  id,
  label,
  accept,
  file,
  previewUrl,
  inputRef,
  onChange,
  onReset,
  type }: FileInputProps) => {
  return (
    <section className="file-input">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="file"
        accept={accept}
        ref={inputRef}
        hidden
        onChange={onChange}
      />
      {!previewUrl ? (
        <figure onClick={()=>inputRef.current?.click()}>
          <Upload className="h-6 w-6 text-slate-600"/>
          <p>Click to upload your {id}</p>
        </figure>
      ) : (
        <div>
          {
            type==='video'?
            <video src={previewUrl} controls/>
            :<Image src={previewUrl} alt="image" fill/>
          }
          <button type="button" onClick={onReset}>
            <X className="h-6 w-6 text-red-400"/>
          </button>
          <p>{file?.name}</p>
        </div>
      )}
    </section>
  )
}

export default FileInput