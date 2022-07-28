module CncSolution.Graph

open System
open System.Web
open Umbraco.Core.Models.PublishedContent
open Umbraco.Web
open Thoth.Json.Net
open System.Linq

type ExportMeta =
    { BaseUrl: string
      MediaToUrl: int -> string
      Cultures: string list }

let private exportMediaCropUrl meta cropName (imageValue:Umbraco.Core.PropertyEditors.ValueConverters.ImageCropperValue) =
    sprintf "%s%s%s" meta.BaseUrl imageValue.Src (imageValue.GetCropUrl(cropName))
    |> Encode.string

let private exportPropertyValue meta (value: obj) =
    try
        match value with
        | :? string as s -> Encode.string s
        | :? int as i -> Encode.int i
        | :? Umbraco.Core.PropertyEditors.ValueConverters.ImageCropperValue as icv when (not (isNull icv)) ->
            icv.Crops
            |> Seq.map (fun crop -> crop.Alias, exportMediaCropUrl meta crop.Alias icv)
            |> Seq.toList
            |> Encode.object
        | :? System.Collections.Generic.IEnumerable<string> as ss ->
            Seq.map Encode.string ss
            |> Seq.toArray
            |> Encode.array
        | :? bool as b -> Encode.bool b
        | _ ->
            printfn "no support for %A" value
            Encode.nil
    with
    | exn ->
        printfn "%A" exn
        Encode.nil

let private exportRichTextProperty culture (node: IPublishedContent) (property: IPublishedProperty) =
    let html = node.Value<IHtmlString>(property.Alias, culture).ToString()
    Encode.string html


let private exportProperty meta (node: IPublishedContent) (property: IPublishedProperty) =
    meta.Cultures
    |> List.map (fun c ->
        if property.PropertyType.DataType.EditorAlias = "Umbraco.MediaPicker" then
            let media = node.Value<IPublishedContent>(property.Alias)
            if isNull media then
                c, Encode.nil
            else
                c, Encode.string (meta.MediaToUrl media.Id)
        elif property.PropertyType.DataType.EditorAlias = "Umbraco.TinyMCE" then
                c, exportRichTextProperty c node property
        elif property.PropertyType.DataType.EditorAlias = "Umbraco.ContentPicker" then
            let content = node.Value<IPublishedContent>(property.Alias)
            if isNull content then
                c, Encode.nil
            else
                c, Encode.int content.Id
        elif property.PropertyType.DataType.EditorAlias = "Umbraco.TrueFalse" then
            let content = node.Value<int>(property.Alias)
            c, Encode.bool (content = 1)
        elif property.PropertyType.DataType.EditorAlias = "Umbraco.Integer" then
            let content = node.Value<int>(property.Alias)
            c, Encode.int content
        else
            let valueForCulture = property.GetValue(c)
            let value =
                try
                    let isEmptyString (v:obj) = match v with | :? string as s -> System.String.IsNullOrWhiteSpace(s) | _ -> false
                    if isNull valueForCulture || (isEmptyString valueForCulture) then property.GetValue() else valueForCulture
                with
                | exn ->
                    printfn "no support for %A, %A" exn node
                    null

            if isNull value then
                printfn "%s is null" property.Alias
            c, exportPropertyValue meta value
    )
    |> fun propertiesPerCulture -> ("type", Encode.string property.PropertyType.DataType.EditorAlias)::propertiesPerCulture
    |> Encode.object

let private exportProperties meta (node: IPublishedContent) =
    node.Properties
    |> Seq.map (fun property ->
        property.Alias, exportProperty meta node property
    )
    |> Seq.toList
    |> Encode.object

let private exportNodeUrls meta (node: IPublishedContent) =
    meta.Cultures
    |> Seq.map (fun c -> c, Encode.string (Umbraco.Web.PublishedContentExtensions.Url(node,c)))
    |> Seq.toList
    |> Encode.object

let rec private exportNode meta (node: IPublishedContent) =
    let exportChildren (node: IPublishedContent) =
        node.Children
        |> Seq.map (exportNode meta)
        |> Seq.toArray
        |> Encode.array

    let properties = exportProperties meta node
    let children = exportChildren node

    Encode.object [
        "id", Encode.int node.Id
        "sortOrder", Encode.int node.SortOrder
        "name", Encode.string node.Name
        "alias", Encode.string node.ContentType.Alias
        "url", exportNodeUrls meta node
        "updateDate", Encode.datetime node.UpdateDate
        "parentId", if isNull node.Parent then Encode.nil else Encode.int node.Parent.Id
        "properties", properties
        "children", children
    ]

[<CompiledName("ExportTree")>]
let exportTree (helper:UmbracoHelper) (baseUrl: string) (rootNode: IPublishedContent) =
    let cultures = rootNode.Cultures.Keys |> Seq.toList
    let mediaIdToUrl (id:int)  =
        match Option.ofObj (helper.Media(id)) with
        | Some m -> m.Url |> sprintf "%s%s" baseUrl
        | None -> null

    let meta =
        { BaseUrl = baseUrl
          MediaToUrl = mediaIdToUrl
          Cultures = cultures }

    Encode.object [
        "cultures", List.toArray cultures |> Array.map Encode.string |> Encode.array
        "root", exportNode meta rootNode
    ]
    |> Encode.toString 4

let rec private getLastUpdate (node:IPublishedContent) : DateTime seq =
        let current = Seq.singleton node.UpdateDate
        let children = Seq.collect id (Seq.map getLastUpdate node.Children)
        Seq.append current children


[<CompiledName("LastUpdateDate")>]
let lastUpdateDate (helper: UmbracoHelper) =
    let rootNode =
        helper.ContentAtRoot()
        |> Seq.head

    getLastUpdate rootNode
    |> Seq.sortDescending
    |> Seq.head