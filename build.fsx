#r "paket: groupref build //"
#load ".fake/build.fsx/intellisense.fsx"

open Fake.Core
open Fake.Core.TargetOperators


Target.create "Build" ignore

Target.runOrDefaultWithArguments "Build"