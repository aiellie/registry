import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert01Icon,
  Cancel01Icon,
  Doc01Icon,
  Image01Icon,
  MusicNote01Icon,
  Pdf01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"

export const attachment = {
  name: "attachment",
  components: {
    Statuses: (
      <div className="flex w-full items-center justify-center p-6">
        <div className="flex w-full max-w-xs flex-col gap-3">
          <Attachment>
            <AttachmentMedia>
              <HugeiconsIcon icon={Pdf01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove attachment">
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="uploading">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>screenshot.png</AttachmentTitle>
              <AttachmentDescription>Uploading… 45%</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Cancel upload">
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment state="error">
            <AttachmentMedia>
              <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>backup.zip</AttachmentTitle>
              <AttachmentDescription>Upload failed</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove attachment">
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </div>
      </div>
    ),
    Sizes: (
      <div className="flex w-full flex-col items-center justify-center gap-3 p-6">
        <Attachment>
          <AttachmentMedia>
            <HugeiconsIcon icon={Doc01Icon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>meeting-notes.docx</AttachmentTitle>
            <AttachmentDescription>Default · 84 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment size="sm">
          <AttachmentMedia>
            <HugeiconsIcon icon={Doc01Icon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>meeting-notes.docx</AttachmentTitle>
            <AttachmentDescription>Small · 84 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment size="xs">
          <AttachmentMedia>
            <HugeiconsIcon icon={Doc01Icon} strokeWidth={2} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>meeting-notes.docx</AttachmentTitle>
          </AttachmentContent>
        </Attachment>
      </div>
    ),
    "Vertical Group": (
      <div className="flex w-full items-center justify-center p-6">
        <AttachmentGroup className="max-w-sm">
          <Attachment orientation="vertical">
            <AttachmentTrigger aria-label="Open cover-art.png" />
            <AttachmentMedia>
              <HugeiconsIcon icon={Image01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>cover-art.png</AttachmentTitle>
              <AttachmentDescription>2.4 MB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentTrigger aria-label="Open intro.mp4" />
            <AttachmentMedia>
              <HugeiconsIcon icon={Video01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>intro.mp4</AttachmentTitle>
              <AttachmentDescription>18 MB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentTrigger aria-label="Open theme.wav" />
            <AttachmentMedia>
              <HugeiconsIcon icon={MusicNote01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>theme.wav</AttachmentTitle>
              <AttachmentDescription>6.1 MB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentTrigger aria-label="Open moodboard.png" />
            <AttachmentMedia>
              <HugeiconsIcon icon={Image01Icon} strokeWidth={2} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>moodboard.png</AttachmentTitle>
              <AttachmentDescription>3.7 MB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </AttachmentGroup>
      </div>
    ),
  },
}
