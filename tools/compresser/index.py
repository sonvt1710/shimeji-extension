import glob
import os


def main():
    old_out_files = glob.glob("./out/*")
    for f in old_out_files:
        os.remove(f)

    in_files = glob.glob("./in/*")
    for img in in_files:
        name = img.split("/")[-1].split(".")[0]
        os.system(f"cwebp -m 6 -pass 10 -mt -q 75 {img} -o ./out/{name}.webp")


if __name__ == "__main__":
    main()