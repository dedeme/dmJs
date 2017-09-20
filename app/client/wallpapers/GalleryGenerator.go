package main

import (
	"io/ioutil"
	"os/exec"
	"path"
	"strings"
)

func main() {
	data := make(map[string][]string)
	root := "/deme/dmjs17/app/client/wallpapers"
	target := path.Join(root, "src", "view", "GalleryAux.js")
	stock := path.Join(root, "www", "stock")
	dirs, _ := ioutil.ReadDir(stock)
	for _, finfo := range dirs {
		dirName := finfo.Name()
		dir := path.Join(stock, dirName)
		fs, _ := ioutil.ReadDir(dir)
		entries := make([]string, 0)
		for _, f := range fs {
			name := f.Name()
			if !strings.HasSuffix(name, ".png") {
				entries = append(entries, name)
			}
		}
		data[dirName] = entries
	}
	tx := `// Copyright 09-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

goog.provide("GalleryAux");

GalleryAux = class {
  /** @return {!Object<string, !Array<string>>} */
  static data () {
    return {
`
	first := true
	for d := range data {
		if first {
			first = false
		} else {
			tx += ",\n"
		}
		tx += "      \"" + d + "\": [\n"
		first2 := true
		for _, f := range data[d] {
			if first2 {
				first2 = false
			} else {
				tx += ",\n"
			}
			tx += "        \"" + f + "\""
		}
		tx += "]"
	}
	tx += "\n    };\n  }\n}\n"
	ioutil.WriteFile(target, []byte(tx), 0755)

	cmd := exec.Command(
		"zenity", "--info", "--text", "Gallery Generator finished")
	cmd.Run()
}
