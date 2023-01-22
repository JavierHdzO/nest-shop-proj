import { PartialType } from '@nestjs/mapped-types';
import { MessageDto } from './message.dto';

export class UpdateMessageDto extends PartialType(MessageDto) {
  id: number;
}
