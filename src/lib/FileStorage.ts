import fs from "fs/promises"
import _path from "path"

interface IFileStorage {
	exists: (path: string) => Promise<boolean>
	delete: (path: string) => Promise<boolean>
	write: (path: string, file: File) => Promise<boolean>
}

type FileStorages = LocalPublicFileStorage

class LocalPublicFileStorage implements IFileStorage {
	private GLOBAL_PATH =
		process.env.PUBLIC_DIR || _path.join(process.cwd(), "public")
	private resolve(path: string) {
		const res = _path.resolve(this.GLOBAL_PATH, path)
		return res
	}

	public async exists(path: string) {
		try {
			const resolved = this.resolve(path)
			const test = await fs.lstat(resolved)
			if (!test || test.isDirectory()) return false
			return true
		} catch {
			return false
		}
	}
	public async write(path: string, file: File | ArrayBuffer) {
		const resolved = this.resolve(path)
		if (await this.exists(resolved)) return false
		try {
			const buffer = file instanceof File ? await file.arrayBuffer() : file
			await fs.writeFile(resolved, Buffer.from(buffer))
			return true
		} catch {
			return false
		}
	}
	public async delete(path: string) {
		const resolved = this.resolve(path)
		if (!(await this.exists(resolved))) return true
		try {
			await fs.rm(resolved)
			return true
		} catch {
			return false
		}
	}
}

export const FileStorage: FileStorages = new LocalPublicFileStorage()
